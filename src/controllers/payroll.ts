const { Op } = require("sequelize");
import { incomesObj } from "../controllers/incomes";
import { outcomesObj } from "../controllers/outcomes";
import { createUnitsListCondition } from "../controllers/users";
const { users, salaries, payroll_schemas, payments_periods, roles } = require("../database/models/index");

interface idObj { id: string }
export function createIdCondition(idRange: number[]) {
    const finalObject: idObj[] = idRange.map((id) => {
        return { "id": `${id}` };
    });

    return finalObject;
}

interface userIdObj { user_id: string }
export function createUserIdCondition(idRange: number[]) {
    const finalObject: userIdObj[] = idRange.map((id) => {
        return { "user_id": `${id}` };
    });

    return finalObject;
}

export async function getAllUsersData(offset: number, limit: number) {
    let usersData;

    try {
        usersData = await users.findAll({
            attributes: ["id"],
            offset,
            limit,
            where: {
                active: true,
                [Op.not]: { id: 1 }
            },
            include: [
                { attributes: ["id", "name"], model: roles },
                { attributes: ["id", "salary"], model: salaries },
                { attributes: ["id", "name"], model: payroll_schemas },
                { attributes: ["id", "name"], model: payments_periods }
            ],
            order: [
                ["id", "ASC"]
            ]
        });

        if (!usersData) {
            return { successful: false, error: "User not found, may be inactive or invalid user." };
        }

    } catch (error) {
        return { successful: false, error: "Query error. Check offset." };
    }

    return { successful: true, usersData };
}

export async function getUserData(id: number) {
    let userData;

    // What if double salary?
    try {
        userData = await users.findOne({
            attributes: ["id"],
            where: {
                id,
                active: true,
                [Op.not]: { id: 1 }
            },
            include: [
                { attributes: ["id", "name"], model: roles },
                { attributes: ["id", "salary"], model: salaries },
                { attributes: ["id", "name"], model: payroll_schemas },
                { attributes: ["id", "name"], model: payments_periods }
            ]
        });

        if (!userData) {
            return { successful: false, error: "User not found, may be inactive or invalid user." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, userData };
}

export async function calculatePayroll(salary: number, incomes?: incomesObj[], outcomes?: outcomesObj[]) {
    let payrollTotal: number = salary;
    let incomesTotal = 0;
    let outcomesTotal = 0;
    let currentVal;

    if (incomes) {
        for (const incomeObj in incomes) {
            const { counter, amount } = incomes[parseInt(incomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                currentVal = parseFloat(amount!);
                payrollTotal += currentVal;
                incomesTotal += currentVal;
            }
        }
    }

    if (outcomes) {
        for (const outcomeObj in outcomes) {
            const { counter, amount } = outcomes[parseInt(outcomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                currentVal = parseFloat(amount!);
                payrollTotal -= currentVal;
                outcomesTotal += currentVal;
            }
        }
    }

    return { payrollTotal, outcomesTotal, incomesTotal };
}

export async function calculatePayrollMassively(usersList: unknown, incomesList: unknown, outcomesList: unknown) {
    // Map with user data 
    // @ts-ignore: Unreachable code error
    const finalMassivePayroll = usersList.map((user) => {
        const { id } = user;
        const payroll_schema = user["payroll_schema"].dataValues["name"];
        const payments_periods = user["payments_period"].dataValues["name"];
        const salary = parseFloat(user["salary"].dataValues["salary"]);

        if (!id || !payroll_schema || !payments_periods || !salary) {
            return { successful: false, error: "Missing one or more parameters: id, payroll_schema, payment_periods, salary." };
        }

        // Incomes section - filters by id
        // income_id, counter, amount, income.name, income.automatic
        let incomesTotal = 0;
        // @ts-ignore: Unreachable code error
        let incomesObject = incomesList.map((income) => {
            const { user_id } = income;

            // Redundant user_id but whatever...
            if (user_id === id) {
                incomesTotal += parseFloat(income.amount);
                return income;
            }
        });

        incomesObject = incomesObject.filter((income: unknown) => income !== undefined);

        // Outcomes section
        let outcomesTotal = 0;
        // @ts-ignore: Unreachable code error
        let outcomesObject = outcomesList.map((outcome) => {
            const { user_id } = outcome;

            // Redundant user_id but whatever...
            if (user_id === id) {
                outcomesTotal += parseFloat(outcome.amount);
                return outcome;
            }
        });

        outcomesObject = outcomesObject.filter((outcome: unknown) => outcome !== undefined);


        // Return final user object
        return {
            id,
            payroll_schema,
            payments_periods,
            salary,
            incomes: incomesObject,
            outcomes: outcomesObject,
            payrollTotal: {
                payrollTotal: salary + incomesTotal - outcomesTotal,
                incomesTotal,
                outcomesTotal
            }
        };
    });

    return { successful: true, finalMassivePayroll };
}

export function createList(listWithObjects: Array<{ id: number }> | undefined) {
    const finalList: Array<number> = [];

    for (const element in listWithObjects) {
        finalList.push(listWithObjects[parseInt(element)].id);
    }

    return finalList;
}

// Check the most recent???
export async function getSalary(userId: number) {
    let salaryData;

    try {
        salaryData = await salaries.findOne({
            attributes: ["salary"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            raw: true
        });

        if (!salaryData) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, salaryData };
}

export async function getNewSalaryId() {
    const max = await salaries.max("id");
    return parseInt(max);
}

export async function createSalary(userId: number, salary: number) {
    // Check if salary exists... 
    let salaryQueryResult;

    try {
        salaryQueryResult = await salaries.findOne({
            attributes: ["id"],
            where: {
                user_id: userId,
                deletedAt: null
            }
        });

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    // If it does, update-delete it...
    if (salaryQueryResult) {
        // Update salary table
        await salaries.destroy({
            where: { id: salaryQueryResult.id }
        });
    }

    // Otherwise, or consequently, create it
    try {
        await salaries.create({
            user_id: userId,
            salary,
            date: new Date()
        });

        // Update user table
        const newSalaryId = await getNewSalaryId();
        await users.update({ salary_id: newSalaryId }, {
            where: { id: userId }
        });

    } catch (error) {
        return { successful: false, error: "Either unable to create salary entry OR unable to update users table." };
    }

    return { successful: true };
}

export async function getRoles(userId: number) {
    const userData = await users.findOne({
        where: { id: userId }
    });

    return userData;
}

export async function getIdsUnderBusinessUnit(businessUnits?: Array<number>): Promise<{ successful: boolean; userList: Array<{ id: number }> | undefined }> {
    let userList;

    if (businessUnits) {
        try {
            const unitsList = createUnitsListCondition(businessUnits);

            userList = await users.findAll({
                attributes: ["id"],
                where: {
                    [Op.or]: unitsList,
                    id: {
                        [Op.ne]: 1
                    }
                }
            });

        } catch {
            return { successful: false, userList: undefined };
        }

        return { successful: true, userList };
    }

    try {
        userList = await users.findAll({
            attributes: ["id"],
            raw: true
        });

    } catch (error) {
        return { successful: false, userList: undefined };
    }

    return { successful: true, userList };
}

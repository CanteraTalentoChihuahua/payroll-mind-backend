import { incomesObj } from "../controllers/incomes";
import { outcomesObj } from "../controllers/outcomes";
import { createUnitsListCondition } from "../controllers/users";
const { Op } = require("sequelize");
const { users, salaries, payroll_schemas, payments_periods, roles, incomes } = require("../database/models/index");


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
                currentVal = counter as number * parseFloat(amount!);
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
                currentVal = counter as number * parseFloat(amount!);
                payrollTotal -= currentVal;
                outcomesTotal += currentVal;
            }
        }
    }

    return { payrollTotal, outcomesTotal, incomesTotal };
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



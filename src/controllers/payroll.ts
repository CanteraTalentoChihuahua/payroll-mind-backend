import db from "../database/database";
import { incomesObj } from "../controllers/incomes";
import { outcomesObj } from "../controllers/outcomes";
import { createUnitsListCondition } from "../controllers/users";

const { Op } = require("sequelize");
const users = require("../database/models/users")(db);
const salaries = require("../database/models/salaries")(db);

const attributesList = ["active", "role_id", "payment_period_id", "salary_id", "payroll_schema_id"];

export function createList(listWithObjects: Array<{ id: number }> | undefined) {
    const finalList: Array<number> = [];

    for (const element in listWithObjects) {
        finalList.push(listWithObjects[parseInt(element)].id);
    }

    return finalList;
}

// Query incomes, outc
// Queries only active collabs
export async function getUserData(id: number) {
    let userData;

    // Cannot query id=1
    try {
        userData = await users.findOne({
            attributes: attributesList,
            where: {
                id,
                active: true
            }
        });

        if (!userData) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, userData };
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

export async function calculatePayroll(salary: number, incomes?: incomesObj[], outcomes?: outcomesObj[]) {
    let payrollTotal: number = salary;
    let incomesTotal = 0;
    let outcomesTotal = 0;

    if (incomes) {
        for (const incomeObj in incomes) {
            const { counter, amount } = incomes[parseInt(incomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                payrollTotal += parseFloat(amount!);
                incomesTotal += parseFloat(amount!);
            }
        }
    }

    if (outcomes) {
        for (const outcomeObj in outcomes) {
            const { counter, amount } = outcomes[parseInt(outcomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                payrollTotal -= parseFloat(amount!);
                outcomesTotal += parseFloat(amount!);
            }
        }
    }

    return { payrollTotal, incomesTotal, outcomesTotal };
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


// Massive methods-----------------
export async function getMassiveUserData(idList: Array<number>) {
    let userData;

    // Create an id array for querying... CAN BE FACTORED INTO A FUNC
    const idQueryList: { id: number }[] = [];

    for (const id in idList) {
        idQueryList.push({ "id": idList[parseInt(id)] });
    }

    // Cannot query id=1
    try {
        userData = await users.findAll({
            attributes: attributesList,
            where: {
                [Op.or]: idQueryList,
                active: true
            }
        });

        if (!userData) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, userData };
}

export async function getMassiveSalary(idList: Array<number>) {
    let salaryData;

    const idQueryList: { user_id: number }[] = [];

    for (const id in idList) {
        idQueryList.push({ "user_id": idList[parseInt(id)] });
    }

    try {
        salaryData = await salaries.findAll({
            attributes: ["salary"],
            where: {
                [Op.or]: idQueryList,
                deletedAt: null
            },
            raw: true
        });

        if (!salaryData.length) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, salaryData };
}

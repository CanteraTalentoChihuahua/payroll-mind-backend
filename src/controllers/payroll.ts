import { incomesObj } from "../controllers/incomes";
import { outcomesObj } from "../controllers/outcomes";
import { createUnitsListCondition } from "../controllers/users";

const { Op } = require("sequelize");
const {users, salaries} = require("../database/models/index");

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

        if (!salaryData.length) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, salaryData };
}

export async function calculatePayroll(salary: number, incomes?: incomesObj[], outcomes?: outcomesObj[]) {
    let payrollTotal: number = salary;

    if (incomes) {
        for (const incomeObj in incomes) {
            const { counter, amount } = incomes[parseInt(incomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                payrollTotal += counter as number * parseFloat(amount!);
            }
        }
    }

    if (outcomes) {
        for (const outcomeObj in outcomes) {
            const { counter, amount } = outcomes[parseInt(outcomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                payrollTotal -= counter as number * parseFloat(amount!);
            }
        }
    }

    return payrollTotal;
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

import { Op } from "sequelize";
import { newIncomeData } from "../util/objects";
import { createIdCondition } from "../controllers/payroll";
const { incomes, incomes_users } = require("../database/models/index");

// What if an outcome / income is inactive? How to activate it?
// Activate endpoint...

export interface entryObj {
    name: string, automatic: boolean, active: boolean
}

export interface incomesObj {
    "income_id": number | undefined | null,
    "counter": number | undefined | null,
    "amount": string | undefined | null,
    "name": string | undefined | null,
    "automatic": boolean | undefined | null
}

export async function createIncome(incomeData: entryObj) {
    try {
        await incomes.create({
            ...incomeData,
            createdAt: new Date()
        });

    } catch (error) {
        return { successful: false };
    }

    return { successful: true };
}

export async function createUserIncome(userId: number, incomeUserData: newIncomeData) {
    let incomesData;

    // Check if income exists
    try {
        incomesData = await incomes.findOne({
            attributes: ["name", "automatic"],
            where: {
                id: incomeUserData.income_id,
                active: true
            },
            raw: true
        });

        if (!incomesData) {
            return { successful: false, found: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // Income entry exist, check if incomeUsers exist
    const updateObj = { counter: incomeUserData.counter, amount: incomeUserData.amount };
    const entryResult = await incomes_users.update(updateObj, {
        where: {
            income_id: incomeUserData.income_id,
            user_id: userId
        }
    });

    // Does not exists, create incomeUsers entry
    if (entryResult[0] === 0) {
        await incomes_users.create({
            user_id: userId,
            ...incomeUserData,
            createdAt: new Date(),
            updatedAt: null
        });

        return { successful: true };
    }

    return { successful: true, updated: true };
}



export async function getAllUsersIncomes(idRange: number[]) {
    let incomesData;
    const finalIdList = createIdCondition(idRange);

    try {
        incomesData = await incomes_users.findAll({
            attributes: ["user_id", "income_id", "counter", "amount"],
            where: {
                [Op.or]: finalIdList,
                deletedAt: null
            },
            include: {
                attributes: ["name", "automatic"],
                model: incomes,
                where: {
                    active: true,
                    deletedAt: null
                }
            },
            raw: true
        });

        if (!incomesData) {
            return { successful: false, error: "No incomes found." };
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    return { successful: true, incomesData };
}

export async function getAllIncomes(): Promise<unknown[]> {
    return await incomes.findAll({
        attributes: [
            "id",
            "name",
            "automatic",
            "active"
        ], where: { deletedAt: null }
    });
}

export async function getIncomes(userId: number) {
    let incomesData;

    try {
        incomesData = await incomes_users.findAll({
            attributes: ["income_id", "counter", "amount"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            include: {
                attributes: ["name", "automatic"],
                model: incomes,
                where: {
                    active: true,
                    deletedAt: null
                }
            },
            raw: true
        });

        if (!incomesData) {
            return { successful: false, error: "No incomes found." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, incomesData };
}

export function createRange(lowEnd: number, highEnd: number) {
    const range: number[] = [];
    for (let i = lowEnd; i <= highEnd; i++) {
        range.push(i);
    }

    return range;
}

// Must certainly be a more efficient way?
export async function getNewIncomeId() {
    const max = await incomes.max("id");
    return parseInt(max);
}


export async function editIncome(id: number, name: string | undefined, automatic: boolean | undefined, active: boolean | undefined): Promise<void> {
    await incomes.update({
        name,
        automatic,
        active
    }, {
        where: { id }
    });
}

export async function deleteIncome(id: number): Promise<void> {
    await incomes.destroy({
        where: { id }
    });
}

export async function assignIncome(user_id: number, income_id: number, counter: number, amount: number, automatic: boolean): Promise<void> {
    await incomes_users.create({
        user_id,
        income_id,
        counter,
        amount,
        automatic
    });
}

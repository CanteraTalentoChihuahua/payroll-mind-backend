import { Op } from "sequelize";
import { newIncomeData } from "../util/objects";
import { createUserIdCondition } from "../controllers/payroll";
import * as c from "./jira";
const { incomes, incomes_users, pre_payments } = require("../database/models/index");

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

export async function createIncome(incomeData: { name: string, automatic: boolean }) {
    try {
        await incomes.create({
            ...incomeData,
            active: true,
            createdAt: new Date()
        });

    } catch (error) {
        return { successful: false, error: "Unable to create income. Might exist already." };
    }

    return { successful: true };
}

// NOTE -- MISSING COUNTER INCREMENT
export async function createUserIncome(user_id: number, incomeUserData: { income_id: number, amount: number | undefined, automatic: boolean | undefined, counter: number | undefined }) {
    let incomesData;

    // Check if income exists, income_id might be wrong...
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
            return { successful: false, error: `No income under income_id: ${incomeUserData.income_id}.` };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // Income entry exist, check if incomeUsers exist
    let entryResult;
    try {
        entryResult = await incomes_users.update({ ...incomeUserData }, {
            where: {
                income_id: incomeUserData.income_id,
                user_id
            }
        });

    } catch (error) {
        console.log(error);

        return { successful: false, error: "Query error." };
    }

    // Does not exist, create incomeUsers entry
    if (entryResult[0] === 0) {
        try {
            await incomes_users.create({
                user_id,
                ...incomeUserData,
                createdAt: new Date()
            }, { returning: false });

        } catch (error) {
            return { successful: false, error: "Unable to create incomes_users entry." };
        }

        return { successful: true };
    }

    return { successful: true, updated: true };
}

export async function getAllUsersIncomes() {
    let incomesData;
    try {
        incomesData = await incomes_users.findAll({
            attributes: ["user_id", "income_id", "counter", "amount"],
            where: {
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

export async function getUsersIncomes(incomesArray: Array<number>) {
    const idCondition = createIdCondition(incomesArray);

    try {
        incomesArray = await incomes_users.findAll({
            attributes: ["income_id", "counter", "amount"],
            where: {
                [Op.or]: idCondition
            },
            include: {
                attributes: ["name", "automatic"],
                model: incomes
            },
            raw: true
        });

        if (!incomesArray) {
            return { successful: false, error: "No incomes_user found." };
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    return { successful: true, incomesArray };
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

// For prepayments
export async function updateIncomesArray(user_id: number) {
    let incomesData;
    try {
        incomesData = await incomes_users.findAll({
            attributes: ["income_id"],
            where: {
                user_id
            },
            raw: true
        });

        if (!incomesData) {
            return { successful: false, error: "No incomes found." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // @ts-ignore: Unreachable code error
    const incomesIdArray = incomesData.map((income) => {
        const { income_id } = income;
        return income_id;
    });

    try {
        await pre_payments.update({ incomes: { incomes: incomesIdArray } }, {
            where: { user_id }
        });

    } catch (error) {
        return { successful: false, error: "Could not update incomes array." };
    }

    return { successful: true, incomesData };
}

export async function getCurrentIncomesUsers(user_id: number) {
    let incomesData;

    try {
        incomesData = await incomes_users.findAll({
            attributes: ["income_id", "counter", "amount"],
            where: {
                user_id,
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

export async function getIncomes(idArray: number[]) {
    const idCondition = createIdCondition(idArray);

    let incomesArray;
    try {
        incomesArray = await incomes.findAll({
            attributes: ["name", "automatic"],
            where: {
                [Op.or]: idCondition
            },
            raw: true
        });

    } catch (error) {
        return { successful: false, error: "Query error at incomes." };
    }

    return { successful: true, incomesArray };
}

export function createRange(highEnd: number, lowEnd?: number) {
    if (!lowEnd) {
        lowEnd = 1;
    }

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

export async function deleteUsersIncomes(incomesArray: unknown) {
    // @ts-ignore: Unreachable code 
    const idCondition = createIdCondition(incomesArray);

    try {
        await incomes_users.destroy({
            where: { [Op.or]: idCondition }
        });

    } catch (error) {
        console.log(error);
    }
}

export async function assignIncome(user_id: number, income_id: number, counter: number, amount: number, automatic: boolean): Promise<void> {
    await incomes_users.create({
        user_id,
        income_id,
        counter,
        amount,
        automatic
    }, { returning: false });
}

export async function assignBonusByStoryPoints() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // What in the name of all that is sacred did I do to end up creating stuff like the code below?
    const bestThree = Object.entries(await c.fetchStoryPointsOfPeriod(lastMonth, new Date()))
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    for (const entry of bestThree) {
        await assignIncome(parseInt(entry[0]), 5, 1, 3000, false);
    }
}

export async function deleteAllUsersIncomes() {
    await incomes_users.destroy({ where: {} });
}

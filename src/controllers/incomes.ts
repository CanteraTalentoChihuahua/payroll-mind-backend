import db from "../database/database";
import { newIncomeData, newOutcomeData } from "../util/objects";

const incomes_users = require("../database/models/incomes_users")(db);
const incomes = require("../database/models/incomes")(db);

interface incomeObj {
    name: string, automatic: boolean, active: boolean
}

export async function createIncome(incomeData: incomeObj) {
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
        })

        if (!incomesData) {
            return { successful: false, found: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // Income entry exist, check if incomeUsers exist
    const updateObj = { counter: incomeUserData.counter, amount: incomeUserData.amount }
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
            createdAt: new Date()
        });

        return { successful: true }
    }

    return { successful: true, updated: true };
}

export async function getIncomesLength() {
    const data = await incomes.findAll()
    return parseInt(data.length);
}
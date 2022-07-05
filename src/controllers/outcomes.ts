import { Op } from "sequelize";
import db from "../database/database";
import { newOutcomeData } from "../util/objects";
const outcomes = require("../database/models/outcomes")(db);
const outcomes_users = require("../database/models/outcomes_users")(db);

interface entryObj {
    name: string, automatic: boolean, active: boolean
}

export interface outcomesObj {
    "outcome_id": number | undefined | null,
    "counter": number | undefined | null,
    "amount": string | undefined | null,
    "name": string | undefined | null,
    "automatic": boolean | undefined | null
}

export async function createOutcome(outcomeData: entryObj) {
    try {
        await outcomes.create({
            ...outcomeData,
            createdAt: new Date()
        });

    } catch (error) {
        return { successful: false };
    }

    return { successful: true };
}

export async function createUserOutcome(userId: number, outcomeUserData: newOutcomeData) {
    let outcomesData;

    // Check if outcome exists
    try {
        outcomesData = await outcomes.findOne({
            attributes: ["name", "automatic"],
            where: {
                id: outcomeUserData.outcome_id,
                active: true
            },
            raw: true
        });

        if (!outcomesData) {
            return { successful: false, found: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // Outcome entry exist, check if outcomeUsers exist
    const updateObj = { counter: outcomeUserData.counter, amount: outcomeUserData.amount };
    const entryResult = await outcomes_users.update(updateObj, {
        where: {
            outcome_id: outcomeUserData.outcome_id,
            user_id: userId
        }
    });

    // Does not exists, create outcomeUsers entry
    if (entryResult[0] === 0) {
        await outcomes_users.create({
            user_id: userId,
            ...outcomeUserData,
            createdAt: new Date(),
            updatedAt: null
        });

        return { successful: true };
    }

    return { successful: true, updated: true };
}

export async function getNewOutcomeId() {
    const max = await outcomes.max("id");
    return parseInt(max);
}

export async function getOutcomes(userId: number) {
    let outcomesData;
    try {
        // Query incomes_users directly -- MUST NOT BE DELETED
        outcomesData = await outcomes_users.findAll({
            attributes: ["outcome_id", "counter", "amount"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            raw: true
        });

        if (!outcomesData.length) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // Create an id array for querying...
    interface idQuery { id: number; }
    const idList: idQuery[] = [];

    for (const outcomesUsers in outcomesData) {
        idList.push({ "id": parseInt(outcomesData[outcomesUsers].outcome_id) });
    }

    let activeOutcomes: unknown[];
    try {
        // Check their name via the id -- MUST BE ACTIVE
        activeOutcomes = await outcomes.findAll({
            attributes: ["name", "automatic"],
            where: {
                [Op.or]: idList,
                active: true
            },
            raw: true
        });

        if (!activeOutcomes) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // If it works... Create the incomes object -- JOIN ALL DATA
    const outcomesObject: outcomesObj[] = [];


    outcomesData.forEach((outcome: outcomesObj, index: number) => {
        if (!activeOutcomes[index]) {
            return;
        }
        const outcomesObjectElement = Object.assign(outcome, activeOutcomes[index]);
        outcomesObject.push(outcomesObjectElement);
    });


    return { successful: true, outcomesObject, error: null };
}

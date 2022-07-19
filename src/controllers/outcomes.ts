import { Op } from "sequelize";
import { newOutcomeData } from "../util/objects";
import { createUserIdCondition } from "../controllers/payroll";
const { outcomes, outcomes_users } = require("../database/models/index");

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
        outcomesData = await outcomes_users.findAll({
            attributes: ["outcome_id", "counter", "amount"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            include: {
                attributes: ["name", "automatic"],
                model: outcomes,
                where: {
                    active: true,
                    deletedAt: null
                }
            },
            raw: true
        });

        if (!outcomesData) {
            return { successful: false, error: "Outcomes not found." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, outcomesData };
}

export async function getAllUsersOutcomes(idRange: number[]) {
    let outcomesData;
    const finalIdList = createUserIdCondition(idRange);

    try {
        outcomesData = await outcomes_users.findAll({
            attributes: ["user_id", "outcome_id", "counter", "amount"],
            where: {
                [Op.or]: finalIdList,
                deletedAt: null
            },
            include: {
                attributes: ["name", "automatic"],
                model: outcomes,
                where: {
                    active: true,
                    deletedAt: null
                }
            },
            raw: true
        });

        if (!outcomesData) {
            return { successful: false, error: "No outcomes found." };
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    return { successful: true, outcomesData };
}

export async function getAllOutcomes(): Promise<unknown[]> {
    return await outcomes.findAll({
        attributes: [
            "id",
            "name",
            "automatic",
            "active"
        ], where: { deletedAt: null }
    });
}

export async function editOutcome(id: number, name: string | undefined, automatic: boolean | undefined, active: boolean | undefined): Promise<void> {
    await outcomes.update({
        name,
        automatic,
        active
    }, {
        where: { id }
    });
}

export async function deleteOutcome(id: number): Promise<void> {
    await outcomes.destroy({
        where: { id }
    });
}

export async function assignOutcome(user_id: number, outcome_id: number, counter: number, amount: number, automatic: boolean): Promise<void> {
    await outcomes_users.create({
        user_id,
        outcome_id,
        counter,
        amount,
        automatic
    });
}

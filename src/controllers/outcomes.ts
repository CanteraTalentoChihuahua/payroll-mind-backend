import { Op } from "sequelize";
import { newOutcomeData } from "../util/objects";
import { createIdCondition } from "../controllers/payroll";
const { outcomes, outcomes_users, pre_payments } = require("../database/models/index");

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
        return { successful: false, error: "Unable to create outcome. Might be repeated." };
    }

    return { successful: true };
}

export async function createUserOutcome(user_id: number, outcomeUserData: { outcome_id: number, amount: number | undefined, automatic: boolean | undefined, counter: number | undefined }) {
    let outcomesData;

    // Check if income exists, income_id might be wrong...
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
            return { successful: false, error: `No income under outcome_id: ${outcomeUserData.outcome_id}.` };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // Income entry exist, check if incomeUsers exist
    let entryResult;
    try {
        entryResult = await outcomes_users.update({ ...outcomeUserData }, {
            where: {
                outcome_id: outcomeUserData.outcome_id,
                user_id
            }
        });

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // Does not exist, create incomeUsers entry
    if (entryResult[0] === 0) {
        try {
            await outcomes_users.create({
                user_id,
                ...outcomeUserData,
                createdAt: new Date()
            }, { returning: false });

        } catch (error) {
            return { successful: false, error: "Unable to create outcomes_users entry." };
        }

        return { successful: true };
    }

    return { successful: true, updated: true };
}

// For prepayments
export async function updateOutcomesArray(user_id: number) {
    let outcomesData;
    try {
        outcomesData = await outcomes_users.findAll({
            attributes: ["outcome_id"],
            where: {
                user_id
            },
            raw: true
        });

        if (!outcomesData) {
            return { successful: false, error: "No outcomes found." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // @ts-ignore: Unreachable code error
    const outcomesIdArray = outcomesData.map((outcome) => {
        const { outcome_id } = outcome;
        return outcome_id;
    });

    try {
        await pre_payments.update({ outcomes: { outcomes: outcomesIdArray } }, {
            where: { user_id }
        });

    } catch (error) {
        return { successful: false, error: "Could not update outcomes array." };
    }

    return { successful: true, outcomesData };
}

export async function getNewOutcomeId() {
    const max = await outcomes.max("id");
    return parseInt(max);
}

export async function getCurrentOutcomesUsers(userId: number) {
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

export async function getAllUsersOutcomes() {
    let outcomesData;
    try {
        outcomesData = await outcomes_users.findAll({
            attributes: ["user_id", "outcome_id", "counter", "amount"],
            where: {
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

export async function getOutcomes(idArray: number[]) {
    const idCondition = createIdCondition(idArray);

    let outcomesArray;
    try {
        outcomesArray = await outcomes.findAll({
            attributes: ["name", "automatic"],
            where: {
                [Op.or]: idCondition
            },
            raw: true
        });

    } catch (error) {
        return { successful: false, error: "Query error at outcomes." };
    }

    return { successful: true, outcomesArray };
}

export async function getUsersOutcomes(outcomesArray: Array<number>) {
    const idCondition = createIdCondition(outcomesArray);

    try {
        outcomesArray = await outcomes_users.findAll({
            attributes: ["outcome_id", "counter", "amount"],
            where: {
                [Op.or]: idCondition
            },
            include: {
                attributes: ["name", "automatic"],
                model: outcomes
            },
            raw: true
        });

        if (!outcomesArray) {
            return { successful: false, error: "No incomes_user found." };
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    return { successful: true, outcomesArray };
}

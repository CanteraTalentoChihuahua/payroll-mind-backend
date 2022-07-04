import db from "../database/database";
const outcome = require("../database/models/outcome")(db);
const outcomes_users = require("../database/models/outcomes_users")(db);


export async function createOutcome(name: string, automatic: boolean): Promise<void> {
    await outcome.create({
        name,
        automatic
    });
}

export async function getAllOutcomes(): Promise<unknown[]> {
    return await outcome.findAll({attributes: [
        "id",
        "name",
        "automatic",
        "active"
    ], where: {deletedAt: null}});
}

export async function editOutcome(id: number, name: string | undefined, automatic: boolean | undefined, active: boolean | undefined): Promise<void> {
    await outcome.update({
        name,
        automatic,
        active
    }, {
        where: {id}
    });
}

export async function deleteOutcome(id: number): Promise<void> {
    await outcome.destroy({
        where: {id}
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

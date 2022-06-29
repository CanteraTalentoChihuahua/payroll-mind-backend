import db from "../database/database";
const income = require("../database/models/income")(db);

export async function createIncome(name: string, automatic: boolean): Promise<void> {
    await income.create({
        name,
        automatic
    });
}

export async function getAllIncomes(): Promise<unknown[]> {
    return await income.findAll({attributes: [
        "id",
        "name",
        "automatic",
        "active"
    ], where: {deletedAt: null}});
}

export async function editIncome(id: number, name: string | undefined, automatic: boolean | undefined, active: boolean | undefined): Promise<void> {
    await income.update({
        name,
        automatic,
        active
    }, {
        where: {id}
    });
}

export async function deleteIncome(id: number): Promise<void> {
    await income.destroy({
        where: {id}
    });
}

import { Op } from "sequelize";
import db from "../database/database";

const users = require("../database/models/users")(db);
const roles = require("../database/models/roles")(db);
const salaries = require("../database/models/salaries")(db);

const incomes = require("../database/models/incomes")(db);
const incomes_users = require("../database/models/incomes_users")(db);

const outcomes = require("../database/models/outcomes")(db);
const outcomes_users = require("../database/models/outcomes_users")(db);


const attributesList = ["active", "role_id", "payment_period_id", "salary_id", "payroll_schema_id"];

// Would be easier with require...

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

// Change return objects
// Queries need to be cycled
export async function getIncomes(userId: number) {
    let incomesData;
    try {
        // Query incomes_users directly -- MUST NOT BE DELETED
        incomesData = await incomes_users.findAll({
            attributes: ["income_id", "counter", "amount"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            raw: true
        });

        if (!incomesData) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // Create an id array for querying...
    interface idQuery { id: number; }
    const idList: idQuery[] = [];

    for (const incomesUsers in incomesData) {
        idList.push({ "id": parseInt(incomesData[incomesUsers].income_id) });
    }

    let activeIncomes: unknown[];
    try {
        // Check their name via the id -- MUST BE ACTIVE
        activeIncomes = await incomes.findAll({
            attributes: ["name", "automatic"],
            where: {
                [Op.or]: idList,
                active: true
            },
            raw: true
        });

        if (!incomesData) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // If it works... Create the incomes object -- JOIN ALL DATA
    const incomesObject: unknown[] = [];
    interface incomesRow { income_id: number, counter: number, amount: number; }

    incomesData.forEach((income: incomesRow, index: number) => {
        if (!activeIncomes[index]) {
            return;
        }
        const incomesObjectElement = Object.assign(income, activeIncomes[index]);
        incomesObject.push(incomesObjectElement);
    });

    // console.log(Object.assign(activeIncomes, incomesData));
    return { successful: true, incomesObject };
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

        if (!outcomesData) {
            return { successful: false };
        }

        console.log(outcomesData);

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

        console.log(activeOutcomes);

        if (!activeOutcomes) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    // If it works... Create the incomes object -- JOIN ALL DATA
    const outcomesObject: unknown[] = [];
    // Two objects : activeIncomes, incomesData

    interface outcomesRow { outcome_id: number, counter: number, amount: number; }
    outcomesData.forEach((outcome: outcomesRow, index: number) => {
        if (!activeOutcomes[index]) {
            return;
        }
        const outcomesObjectElement = Object.assign(outcome, activeOutcomes[index]);
        outcomesObject.push(outcomesObjectElement);
    });

    // console.log(Object.assign(activeIncomes, incomesData));
    return { successful: true, outcomesObject };
}

import { Op } from "sequelize";
import db from "../database/database";

const users = require("../database/models/users")(db);
const roles = require("../database/models/roles")(db);
const salaries = require("../database/models/salaries")(db);

const incomes = require("../database/models/incomes")(db);
const incomes_users = require("../database/models/incomes_users")(db);

const outcomes = require("../database/models/incomes")(db);
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

// Queries need to be cycled
export async function getIncomes(userId: number) {
    // Query incomes_users directly -- MUST NOT BE DELETED
    const incomesData = await incomes_users.findAll({
        attributes: ["income_id", "counter", "amount"],
        where: {
            user_id: userId,
            deletedAt: null
        },
        raw: true
    });

    // Create an id array for querying...
    interface idQuery { id: number; }
    const idList: idQuery[] = [];

    for (const incomesUsers in incomesData) {
        idList.push({ "id": parseInt(incomesData[incomesUsers].income_id) });
    }

    // Check their name via the id -- MUST BE ACTIVE
    const activeIncomes = await incomes.findAll({
        attributes: ["name", "automatic"],
        where: {
            [Op.or]: idList,
            active: true
        },
        raw: true
    });

    // If it works... Create the incomes object -- JOIN ALL DATA
    const incomesObject: unknown[] = [];
    // Two objects : activeIncomes, incomesData

    interface incomesRow { income_id: number, counter: number, amount: number; }
    incomesData.forEach((activeIncome: incomesRow, index: number) => {
        const incomesObjectElement = Object.assign(activeIncome, activeIncomes[index]);
        incomesObject.push(incomesObjectElement);
    });

    // console.log(Object.assign(activeIncomes, incomesData));
    return incomesObject;


}

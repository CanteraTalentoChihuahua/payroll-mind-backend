import db from "../database/database";

const users = require("../database/models/users")(db);
const roles = require("../database/models/roles")(db);
const salaries = require("../database/models/salaries")(db);

const incomes = require("../database/models/incomes")(db);
const incomes_users = require("../database/models/incomes_users")(db);

const outcomes = require("../database/models/incomes")(db);
const outcomes_users = require("../database/models/outcomes_users")(db);


const attributesList = ["active", "role_id", "payment_period_id", "salary_id", "payroll_schema_id"]

// Would be easier with require...

// Query incomes, outc
// Queries only active collabs
export async function templateFunction(id: number) {
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

    } catch (error) {
        return { successful: false };
    }

    if (!userData) {
        return { successful: false };
    }

    // Extract salary 


    return { successful: true, userData };
}

// Queries need to be cycled
export async function getIncomes(userId: number) {
    let incomeUsersData;

    // ADAPT TO MULTIPLE
    try {
        incomeUsersData = await incomes_users.findOne({
            where: {
                deletedAt: null,
                user_id: userId
            }
        });

        if (!incomeUsersData) {
            return { successful: false, found: false };
        }

    } catch (error) {
        return { successful: false };
    }

    const incomesData = await incomes.findOne({
        where: {
            id: incomeUsersData.id
        }
    });

    // Check their name, if automatic and active
    const { id, name, automatic, active } = incomesData;

    if (!active) {
        return { successful: true, active };
    }

    let incomesObject;
    if (automatic) {
        incomesObject = { id, name, automatic };
    }

    return { successful: true, incomesObject };
}

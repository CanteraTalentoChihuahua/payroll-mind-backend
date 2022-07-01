import db from "../database/database";

const users = require("../database/models/users")(db);
const roles = require("../database/models/roles")(db);
const salaries = require("../database/models/salaries")(db);
const incomes_users = require("../database/models/incomes_users")(db);
const outcomes_users = require("../database/models/outcomes_users")(db);


const attributesList = ["active", "role_id", "payment_period_id", "salary_id", "payroll_schema_id"]

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

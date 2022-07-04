import { Op } from "sequelize";
import db from "../database/database";

const users = require("../database/models/users")(db);
const salaries = require("../database/models/salaries")(db);

const incomes = require("../database/models/incomes")(db);
const incomes_users = require("../database/models/incomes_users")(db);

const outcomes = require("../database/models/outcomes")(db);
const outcomes_users = require("../database/models/outcomes_users")(db);

const attributesList = ["active", "role_id", "payment_period_id", "salary_id", "payroll_schema_id"];

export interface incomesObj {
    "income_id": number | undefined | null,
    "counter": number | undefined | null,
    "amount": string | undefined | null,
    "name": string | undefined | null,
    "automatic": boolean | undefined | null
}

export interface outcomesObj {
    "outcome_id": number | undefined | null,
    "counter": number | undefined | null,
    "amount": string | undefined | null,
    "name": string | undefined | null,
    "automatic": boolean | undefined | null
}

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

        if (!incomesData.length) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
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
        return { successful: false, error: "Invalid query." };
    }

    // If it works... Create the incomes object -- JOIN ALL DATA
    const incomesObject: incomesObj[] = [];

    incomesData.forEach((income: incomesObj, index: number) => {
        if (!activeIncomes[index]) {
            return;
        }
        const incomesObjectElement = Object.assign(income, activeIncomes[index]);
        incomesObject.push(incomesObjectElement);
    });

    return { successful: true, incomesObject, error: false };
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

// Check the most recent???
export async function getSalary(userId: number) {
    let salaryData;

    try {
        salaryData = await salaries.findAll({
            attributes: ["salary"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            raw: true
        });

        if (!salaryData.length) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, salaryData };
}

export async function calculatePayroll(salary: number, incomes?: incomesObj[] | undefined, outcomes?: outcomesObj[] | undefined) {
    let payrollTotal: number = salary;

    if (incomes) {
        for (const incomeObj in incomes) {
            const { counter, amount } = incomes[parseInt(incomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                payrollTotal += counter as number * parseFloat(amount!);
            }
        }
    }

    if (outcomes) {
        for (const outcomeObj in outcomes) {
            const { counter, amount } = outcomes[parseInt(outcomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                payrollTotal -= counter as number * parseFloat(amount!);
            }
        }
    }

    return payrollTotal;
}

export async function getRoles(userId: number) {
    const userData = await users.findOne({
        where: { id: userId }
    });

    return userData;
}

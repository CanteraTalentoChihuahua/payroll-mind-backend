const { Op } = require("sequelize");
import { incomesObj } from "../controllers/incomes";
import { outcomesObj } from "../controllers/outcomes";
import { newPrepaymentsData, newTotalsData } from "../util/objects";
import { createUnitsListCondition } from "../controllers/users";
const { users, salaries, payments_periods, payments, pre_payments, incomes_users, incomes,
    outcomes_users, outcomes, pre_payrolls, payrolls } = require("../database/models/index");

interface idObj { id: string }
export function createIdCondition(idRange: number[]) {
    const finalObject: idObj[] = idRange.map((id) => {
        return { "id": `${id}` };
    });

    return finalObject;
}

interface userIdObj { user_id: string }
export function createUserIdCondition(idRange: number[]) {
    const finalObject: userIdObj[] = idRange.map((id) => {
        return { "user_id": `${id}` };
    });

    return finalObject;
}

export async function calculatePayroll(salary: number, incomes?: incomesObj[], outcomes?: outcomesObj[]) {
    let payrollTotal: number = salary;
    let incomesTotal = 0;
    let outcomesTotal = 0;
    let currentVal;

    if (incomes) {
        for (const incomeObj in incomes) {
            const { counter, amount } = incomes[parseInt(incomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                currentVal = parseFloat(amount!);
                payrollTotal += currentVal;
                incomesTotal += currentVal;
            }
        }
    }

    if (outcomes) {
        for (const outcomeObj in outcomes) {
            const { counter, amount } = outcomes[parseInt(outcomeObj)];

            if (!counter || !amount) {
                continue;
            } else {
                currentVal = parseFloat(amount!);
                payrollTotal -= currentVal;
                outcomesTotal += currentVal;
            }
        }
    }

    return { payrollTotal, outcomesTotal, incomesTotal };
}

export async function calculatePayrollMassively(usersList: unknown, incomesList: unknown, outcomesList: unknown, currentDay: number) {
    const brutePayrollObject = {
        // global: 0,
        business_unit: {}
    };

    // Map with user data 
    // @ts-ignore: Unreachable code error
    const comprehensivePayrollObject = usersList.map((user) => {
        const { id, salary_id, payment_period_id, payroll_schema_id, business_unit } = user;
        const { business_unit_ids } = business_unit;
        let salary = parseFloat(user["salary"].dataValues["salary"]);

        if (!id || !payroll_schema_id || !payment_period_id || !salary_id || !business_unit) {
            return { successful: false, error: "Missing one or more parameters: id, payroll_schema, payment_periods, salary." };
        }

        // Check payment period, solely pay half for quincenal - pay full if mensual
        if (payment_period_id === 1) {
            salary /= 2;
        }

        // Check day of payroll calculation
        const currentDate = new Date();
        // currentDay = currentDate.getDay();
        let incomesObject, outcomesObject;
        let incomesTotal = 0, outcomesTotal = 0;

        // If first of the month, assign incomes and outcomes for both
        if (currentDay === 1) {
            // Incomes section - filters by id
            incomesTotal = 0;
            // @ts-ignore: Unreachable code error
            incomesObject = incomesList.map((income) => {
                const { user_id, amount, income_id } = income;

                // Redundant user_id but whatever...
                if (user_id === id) {
                    incomesTotal += parseFloat(amount);
                    return income_id;
                }
            }); 
            
            incomesObject = incomesObject.filter((income: unknown) => income !== undefined);

            // Outcomes section
            outcomesTotal = 0;
            // @ts-ignore: Unreachable code error
            outcomesObject = outcomesList.map((outcome) => {
                const { user_id, amount, outcome_id } = outcome;

                // Redundant user_id but whatever...
                if (user_id === id) {
                    outcomesTotal += parseFloat(amount);
                    return outcome_id;
                }
            });

            outcomesObject = outcomesObject.filter((outcome: unknown) => outcome !== undefined);
        }

        // Calculate payroll total
        const payrollTotal = salary + incomesTotal - outcomesTotal;

        // NOTE - If in multiple business units, assign to the first one
        // Add to business unit payroll
        if (!(business_unit_ids[0] in brutePayrollObject["business_unit"])) {
            const payrollObject = {
                payrollTotal,
                salariesTotal: salary,
                incomesTotal,
                outcomesTotal,
            };
            // @ts-ignore: Unreachable code error
            brutePayrollObject["business_unit"][business_unit_ids[0]] = payrollObject;

        } else {
            // @ts-ignore: Unreachable code error
            const existingPayrollObject = brutePayrollObject["business_unit"][business_unit_ids[0]];
            existingPayrollObject["payrollTotal"] += payrollTotal;
            existingPayrollObject["salariesTotal"] += salary;
            existingPayrollObject["incomesTotal"] += incomesTotal;
            existingPayrollObject["outcomesTotal"] += outcomesTotal;
        }

        // // Add to massive payroll
        // // @ts-ignore: Unreachable code error
        // brutePayrollObject["global"] += parseFloat(payrollTotal);

        // Return final user object
        return {
            id,
            salary_id,
            payment_period_id,
            payroll_schema_id,
            business_unit,

            incomes: incomesObject,
            outcomes: outcomesObject,

            payrollTotal: {
                payrollTotal,
                incomesTotal,
                outcomesTotal
            }
        };
    });

    return { successful: true, comprehensivePayrollObject, brutePayrollObject };
}

export function createList(listWithObjects: Array<{ id: number }> | undefined) {
    const finalList: Array<number> = [];

    for (const element in listWithObjects) {
        finalList.push(listWithObjects[parseInt(element)].id);
    }

    return finalList;
}

// Check the most recent???
export async function getSalary(userId: number) {
    let salaryData;

    try {
        salaryData = await salaries.findOne({
            attributes: ["salary"],
            where: {
                user_id: userId,
                deletedAt: null
            },
            raw: true
        });

        if (!salaryData) {
            return { successful: false };
        }

    } catch (error) {
        return { successful: false };
    }

    return { successful: true, salaryData };
}

export async function getNewSalaryId() {
    const max = await salaries.max("id");
    return parseInt(max);
}

export async function createSalary(userId: number, salary: number) {
    // Check if salary exists... 
    let salaryQueryResult;

    try {
        salaryQueryResult = await salaries.findOne({
            attributes: ["id"],
            where: {
                user_id: userId,
                deletedAt: null
            }
        });

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    // If it does, update-delete it...
    if (salaryQueryResult) {
        // Update salary table
        await salaries.destroy({
            where: { id: salaryQueryResult.id }
        });
    }

    // Otherwise, or consequently, create it
    try {
        await salaries.create({
            user_id: userId,
            salary,
            date: new Date()
        });

        // Update user table
        const newSalaryId = await getNewSalaryId();
        await users.update({ salary_id: newSalaryId }, {
            where: { id: userId }
        });

    } catch (error) {
        return { successful: false, error: "Either unable to create salary entry OR unable to update users table." };
    }

    return { successful: true };
}

export async function getRoles(userId: number) {
    const userData = await users.findOne({
        where: { id: userId }
    });

    return userData;
}

export async function getIdsUnderBusinessUnit(businessUnits?: Array<number>): Promise<{ successful: boolean; userList: Array<{ id: number }> | undefined }> {
    let userList;

    if (businessUnits) {
        try {
            const unitsList = createUnitsListCondition(businessUnits);

            userList = await users.findAll({
                attributes: ["id"],
                where: {
                    [Op.or]: unitsList,
                    id: {
                        [Op.ne]: 1
                    }
                }
            });

        } catch {
            return { successful: false, userList: undefined };
        }

        return { successful: true, userList };
    }

    try {
        userList = await users.findAll({
            attributes: ["id"],
            raw: true
        });

    } catch (error) {
        return { successful: false, userList: undefined };
    }

    return { successful: true, userList };
}



/// Experimental methods
// Should not query id: 1
export async function getAllPrePayrolls(offset?: number, limit?: number) {
    let payrollData;
    try {
        // @ts-ignore: Unreachable code error
        payrollData = await pre_payments.findAll({
            attributes: ["id", "user_id", "incomes", "total_incomes", "outcomes", "total_outcomes", "total_amount", "payment_period_id", "payment_date"],
            offset,
            limit,
            include: [
                { attributes: ["salary"], model: salaries },
                { attributes: ["name"], model: payments_periods }
            ],
            order: [
                ["user_id", "ASC"]
            ],
            raw: true
        });

        if (payrollData.length === 0) {
            return { successful: false, error: "No payrolls found." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, payrollData };
}

export async function buildFinalPayrollObject(userArray: unknown) {
    const finalPayrollArray = [];

    // @ts-ignore: Unreachable code error
    for (const userIndex in userArray) {
        // Locate current user
        // @ts-ignore: Unreachable code error
        const user = userArray[userIndex];

        // Extract incomes / outcomes data
        const { incomes } = user;
        const { outcomes } = user;

        const filteredIncomes = incomes["incomes"];
        const filteredOutcomes = outcomes["outcomes"];

        // Create id conditions
        const incomesIdCondition = createIdCondition(filteredIncomes);
        const outcomesIdCondition = createIdCondition(filteredOutcomes);

        // Query incomes
        let incomesData;
        try {
            // @ts-ignore: Unreachable code error
            incomesData = await getAllUsersIncomes(incomesIdCondition);

        } catch (error) {
            return { successful: false, error: "Query error at incomes." };
        }

        // Query outcomes
        let outcomesData;
        try {
            // @ts-ignore: Unreachable code error
            outcomesData = await getAllUsersOutcomes(outcomesIdCondition);

        } catch (error) {
            return { successful: false, error: "Query error at outcomes." };
        }

        const userObject = {
            id: user.id,
            user_id: user.user_id,
            // payroll_schema: user["payroll_schema.name"],
            payment_period: user["payments_period.name"],
            salary: user["salary.salary"],
            payrollTotal: {
                payrollTotal: user.total_amount,
                incomesTotal: user.total_incomes,
                outcomesTotal: user.total_outcomes
            },
            // @ts-ignore: Unreachable code error
            incomes: incomesData["incomesData"],
            // @ts-ignore: Unreachable code error
            outcomes: outcomesData["outcomesData"]
        };

        finalPayrollArray.push(userObject);
    }

    return { successful: true, finalPayrollArray };
}

export async function getStagedPayrollsLength() {
    let userData;
    try {
        userData = await pre_payments.findAll({
            order: [
                ["user_id", "ASC"]
            ]
        });

        if (userData.length === 0) {
            return { successful: false, payrollLength: 0 };
        }

    } catch (error) {
        return { successful: true, error: "Query error." };
    }

    return { successful: true, payrollLength: userData.length };
}

export async function getPushedPayrollsLength() {
    let userData;
    try {
        userData = await payments.findAll({
            order: [
                ["user_id", "ASC"]
            ]
        });

        if (userData.length === 0) {
            return { successful: false, payrollLength: 0 };
        }

    } catch (error) {
        return { successful: true, error: "Query error." };
    }

    return { successful: true, payrollLength: userData.length };
}

// Must be moved to incomes... Kept here to avoid breaking stuff
export async function getAllUsersIncomes(idCondition: number[]) {
    let incomesData;

    try {
        incomesData = await incomes_users.findAll({
            attributes: ["user_id", "income_id", "counter", "amount"],
            where: {
                [Op.or]: idCondition,
                deletedAt: null
            },
            include: {
                attributes: ["name", "automatic"],
                model: incomes,
                where: {
                    active: true,
                    deletedAt: null
                }
            },
            raw: true
        });

        if (!incomesData) {
            return [];
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    return { successful: true, incomesData };
}

// Must be moved to outcomes... Kept here to avoid breaking stuff
export async function getAllUsersOutcomes(idCondition: number[]) {
    let outcomesData;

    try {
        outcomesData = await outcomes_users.findAll({
            attributes: ["user_id", "outcome_id", "counter", "amount"],
            where: {
                [Op.or]: idCondition,
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
            return [];
        }

    } catch (error) {
        return { successful: false, error: "Invalid query." };
    }

    return { successful: true, outcomesData };
}

export async function pushToPayments() {
    // Find all available prepayments
    let pre_paymentsData;
    try {
        pre_paymentsData = await pre_payments.findAll({
            attributes: ["user_id", "salary_id", "incomes", "total_incomes", "outcomes", "total_outcomes", "total_amount", "payment_period_id", "payment_date"],
            order: [["id", "ASC"]],
            raw: true
        });

        if (!pre_paymentsData) {
            return { successful: false, error: "Nothing to push." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // Assign them to payments
    try {
        await payments.bulkCreate([...pre_paymentsData]);

    } catch (error) {
        return { successful: true, error: "Error creating rows at payments." };
    }

    // Remove the from prepayments
    try {
        await pre_payments.destroy({
            where: {}
        });

    } catch (error) {
        return { successful: true, error: "Error destroying rows at pre_payments." };
    }

    return { successful: true };
}

export async function pushToPayrolls() {
    // Find all available prepayments
    let pre_paymentsData;
    try {
        pre_paymentsData = await pre_payrolls.findAll({
            attributes: ["user_id", "salary_id", "incomes", "total_incomes", "outcomes", "total_outcomes", "total_amount", "payment_period_id", "payment_date"],
            order: [["id", "ASC"]],
            raw: true
        });

        if (!pre_paymentsData) {
            return { successful: false, error: "Nothing to push." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    // Assign them to payments
    try {
        await payrolls.bulkCreate([...pre_paymentsData]);

    } catch (error) {
        return { successful: true, error: "Error creating rows at payrolls." };
    }

    // Remove the from prepayments
    try {
        await pre_payrolls.destroy({
            where: {}
        });

    } catch (error) {
        return { successful: true, error: "Error destroying rows at pre_payrolls." };
    }

    return { successful: true };
}


// INSERTS
export async function bulkInsertIntoPrePayments(comprehensivePayroll: unknown) {
    // Delete everything
    try {
        await pre_payments.destroy({ where: {} });

    } catch (error) {
        return { successful: false, error: "Error at pre_payments deletion." };
    }

    // @ts-ignore: Unreachable code error
    for (const payrollIndex in comprehensivePayroll) {
        // @ts-ignore: Unreachable code error
        const currentPayroll = comprehensivePayroll[payrollIndex];
        const { id, salary_id, payment_period_id, payroll_schema_id, business_unit, incomes, outcomes, payrollTotal } = currentPayroll;

        try {
            await pre_payments.create({
                user_id: id,
                salary_id,
                payment_period_id,
                payroll_schema_id,
                business_unit,
                incomes: { "incomes": incomes },
                outcomes: { "outcomes": outcomes },
                total_incomes: payrollTotal.incomesTotal,
                total_outcomes: payrollTotal.outcomesTotal,
                total_amount: payrollTotal.payrollTotal,
                payment_date: new Date()
            });

        } catch (error) {
            return { successful: false, error: "Error at pre_payments creation." };
        }
    }

    return { successful: true };
}


// NOTE - What should be introduced in payment_period_id??
// CHANGE PAYMENT_PERIOD_ID!!!!
export async function bulkInsertIntoPrePayrolls(brutePayroll: unknown) {
    // Deletes everything
    try {
        await pre_payrolls.destroy({ where: {} });

    } catch (error) {
        return { successful: false, error: "Error at pre_payments deletion." };
    }

    // @ts-ignore: Unreachable code error
    const { business_unit } = brutePayroll;
    try {
        for (const [key, value] of Object.entries(business_unit)) {
            // @ts-ignore: Unreachable code error
            const { payrollTotal, salariesTotal, incomesTotal, outcomesTotal } = value;

            await pre_payrolls.create({
                payment_date: new Date(),
                payment_period_id: 1,
                business_unit_id: key,
                total_amount: payrollTotal,
                createdAt: new Date()
            });
        }

    } catch (error) {
        return { successful: false, error: "Error at pre_payroll business_unit creation." };
    }

    return { successful: true };
}

// Calculate global payroll
export async function calculateGlobalPayroll() {
    let globalPayroll;
    try {
        globalPayroll = await pre_payrolls.findAll();

        if (globalPayroll.length == 0) {
            return { successful: false, error: "No payrolls." };
        }

    } catch (error) {
        return { successful: true, error: "Query error." };
    }

    let globalPayrollTotal = 0;
    for (const payrollIndex in globalPayroll) {
        const { total_amount } = globalPayroll[payrollIndex];
        globalPayrollTotal += parseFloat(total_amount);
    }

    return { successful: true, globalPayrollTotal };
}

// Modify prepayroll 
export async function editPrePayments(user_id: number, prepaymentsObject: newPrepaymentsData | { salary_id: number } | { payment_period_id: number } | newTotalsData) {
    try {
        await pre_payments.update({ ...prepaymentsObject }, { where: { user_id } });

    } catch (error) {
        console.log(error);

        return { successful: false, error: "Unable to update prepayments object." };
    }

    return { successful: true };
}

export async function updatePaymentPeriod(payment_period_id: number, user_id: number) {
    try {
        await users.update({ payment_period_id }, {
            where: {
                id: user_id
            }
        });

    } catch (error) {
        return { successful: false, error: "Unable to update payment_period_id on users." };
    }

    // Move into prepayments
    try {
        await pre_payments.update({ payment_period_id }, {
            where: {
                user_id
            }
        });

    } catch (error) {
        return { successful: false, error: "Unable to update payment_period_id on prepayments." };
    }

    return { successful: true };
}

export async function updateTotals(user_id: number, totalObject: {total_incomes: number, total_outcomes: number, total_amount: number}) {
    try {
        await pre_payments.update({...totalObject}, {where: { user_id }});

    } catch (error) {
        return { successful: true, error: "Unable to update prepayments." };
    }

    return { successful: true };
}

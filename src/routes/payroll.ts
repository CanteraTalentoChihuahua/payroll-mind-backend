import express from "express";
import { Privileges, newPrepaymentsData } from "../util/objects";
import privileges from "../middleware/privileges";
import { buildFinalPayrollObject, calculatePayrollMassively, createSalary } from "../controllers/payroll";
import { createIncome, getNewIncomeId, getIncomes, getAllUsersIncomes } from "../controllers/incomes";
import { createOutcome, createUserOutcome, getNewOutcomeId, getOutcomes, getAllUsersOutcomes } from "../controllers/outcomes";
import {
    calculatePayroll, getAllPrePayrolls, getStagedPayrollsLength, pushToPayrolls, pushToPayments, editPrePayments,
    bulkInsertIntoPrePayments, bulkInsertIntoPrePayrolls, calculateGlobalPayroll, getNewSalaryId
} from "../controllers/payroll";

import { getAllUsersDataRaw, getUserData } from "../controllers/users";
import { inRange, showing } from "../controllers/general";

const router = express.Router();

// Create endpoint for calculating payroll massively each time when called

// privileges(Privileges.CREATE_REPORTS, Privileges.READ_REPORTS)

// If pushed... where will they query?

// NEEDS TO CALCULATE FOR NEW USERS
// NOTE - MUST MOVE THIS TO CRONJOB
// Calculates total payroll --- SHOULD TURN INTO A SOLE SCRIPT
router.get("/calculate", async (req, res) => {
    // Query users and check activity
    // @ts-ignore: Unreachable code error
    const usersObject = await getAllUsersDataRaw();
    if (!usersObject.successful) {
        return res.status(400).json({ message: usersObject.error });
    }

    // Query income
    const incomesObject = await getAllUsersIncomes();
    if (!incomesObject.successful) {
        return res.status(400).send({ message: incomesObject.error });
    }

    // Query outcome
    const outcomesObject = await getAllUsersOutcomes();
    if (!outcomesObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    // Extract values -- must be done individually
    const { usersData } = usersObject;
    const { incomesData } = incomesObject;
    const { outcomesData } = outcomesObject;

    // Calculate payroll massively
    const finalMassivePayrollObject = await calculatePayrollMassively(usersData, incomesData, outcomesData);
    // Loop through all checking success status
    if (!finalMassivePayrollObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    // Extract final data
    const { comprehensivePayrollObject, brutePayrollObject } = finalMassivePayrollObject;

    // Save into prepayments
    const insertPrePaymentsObject = await bulkInsertIntoPrePayments(comprehensivePayrollObject);
    if (!insertPrePaymentsObject.successful) {
        return res.status(400).json({ message: insertPrePaymentsObject.error });
    }

    // Save into payrolls
    const insertPrePayrollObject = await bulkInsertIntoPrePayrolls(brutePayrollObject);
    if (!insertPrePayrollObject.successful) {
        return res.status(400).json({ message: insertPrePayrollObject.error });
    }

    // For visualization purposes, front won't use this
    return res.status(200).send({
        comprehensivePayrollObject,
        brutePayrollObject
    });
});

// Calculate global
router.get("/calculate/global", async (req, res) => {
    const globalPayrollObject = await calculateGlobalPayroll();
    if (!globalPayrollObject.successful) {
        return res.status(400).json({ message: globalPayrollObject.error });
    }

    return res.status(200).send({ globalPayrollTotal: globalPayrollObject.globalPayrollTotal });
});

// Query pre_payments
// Must return a total of users in order for pagination calculation
router.get("/prepayroll", async (req, res) => {
    // Check for offset and limit
    let offset = 0, limit = 10;
    if (req.query.limit) {
        // @ts-ignore: Unreachable code error
        limit = parseInt(req.query["limit"]);
    }

    if (req.query.offset) {
        // @ts-ignore: Unreachable code error
        offset = parseInt(req.query["offset"]);
    }

    // Query payroll data
    // Is this allowed? Waste of resources?
    const payrollObject = await getAllPrePayrolls(offset, limit);
    if (!payrollObject.successful) {
        return res.status(400).json({ message: payrollObject.error });
        // payrollObject = await getAllPayrolls(offset, limit);
        // if (!payrollObject.successful) {
    }

    // Build payroll object
    const { payrollData } = payrollObject;
    const finalPayrollObject = await buildFinalPayrollObject(payrollData);
    if (!finalPayrollObject.successful) {
        // @ts-ignore: Unreachable code error
        return res.status(400).json({ message: finalPayrollObject.error });
    }

    // Query total user amount
    const payrollLengthObject = await getStagedPayrollsLength();
    if (!payrollLengthObject.successful) {
        // Must be a TIME ELEMENT TO IT, how will they be distinguished?
        return res.status(400).json({ message: payrollLengthObject.error });

        // payrollLengthObject = await getPushedPayrollsLength();
        // if (!payrollLengthObject.successful) {
        //     return res.status(400).json({ message: payrollLengthObject.error });
        // }
    }

    // Adds readability
    const { payrollLength } = payrollLengthObject;
    const comprehensivePayroll = {
        read: {
            showing: showing(offset, limit, payrollLength),
            outOf: payrollLengthObject.payrollLength,
            currentRange: [offset, inRange(offset, limit, payrollLength)]
        },
        payrolls: finalPayrollObject.finalPayrollArray
    };

    return res.status(200).send(comprehensivePayroll);
});

// Moves data from pre_payments to payments
// Ask front to double confirm before calling this endpoint...
// NOTE - IF A CERTAIN TIME PASSES WITH NO CONFIRMATION, CRONJOB SHOULD CALL THIS
router.post("/push", async (req, res) => {
    const pushObject = await pushToPayments();
    if (!pushObject.successful) {
        return res.status(400).json({ message: pushObject.error });
    }

    const nextPushObject = await pushToPayrolls();
    if (!nextPushObject.successful) {
        return res.status(400).json({ message: nextPushObject.error });
    }

    return res.status(200).json({ message: "Successfully registered payments." });
});

// NOTE - MUST MOVE THIS TO CRONJOB
router.get("/:id", privileges(Privileges.CREATE_REPORTS, Privileges.READ_REPORTS), async (req, res) => {
    const { id } = req.params;

    // Query user and check activity
    const userObject = await getUserData(parseInt(id));
    if (!userObject.successful) {
        return res.status(400).send({ message: userObject.error });
    }

    // Query income
    const incomesObject = await getIncomes(parseInt(id));
    if (!incomesObject.successful) {
        return res.status(400).send({ message: incomesObject.error });
    }

    // Query outcome
    const outcomesObject = await getOutcomes(parseInt(id));
    if (!outcomesObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    // Extract values
    const { userData } = userObject;
    const { incomesData } = incomesObject;
    const { outcomesData } = outcomesObject;
    const { salary } = userData["salary"];

    // Calculate payroll
    const payroll = await calculatePayroll(parseFloat(salary), incomesData, outcomesData);

    // Build final JSON object
    const finalPayrollObject = {
        payroll_schema: userData["payroll_schema"].name,
        payment_period: userData["payments_period"].name,
        salary: salary,
        incomes: incomesData,
        outcomes: outcomesData,
        payrollTotal: payroll
    };

    return res.status(200).send(finalPayrollObject);
});




// ----- USELESS, MUST BE READAPT TO PRE_PAYMENTS TABLE

// Edit prepayment values
// router.put("/prepayroll", async (req, res) => {
//     // Receive data available to edit and row id
//     // Can only edit incomes, 
//     const { id, user_id, total_incomes, total_outcomes, total_amount } = req.body;

//     // Validations
//     // NOTE -- CONVERT THE FOLLOWING VALIDATION INTO A FUNCTION
//     if (!id || !user_id) {
//         // @ts-ignore: Unreachable code error
//         const varToString = varObj => Object.keys(varObj);
//         const displayName = varToString({ id, user_id });
//         const comparer = [id, user_id];

//         const missingVars: (string | undefined)[] = [];
//         comparer.forEach((variable, index) => {
//             if (variable === undefined) {
//                 missingVars.push(displayName[index]);
//             }
//         });

//         return res.status(400).json({ message: `Missing the following parameters: ${missingVars}.` });
//     }

//     // If salary edit...
//     let salary_id;
//     if (salary) {
//         if (isNaN(parseFloat(salary)) || parseFloat(salary) <= 0) {
//             return res.status(400).json({ message: "Invalid type on salary. Must be a number bigger than 0. " });
//         }

//         // Create new salary
//         const createSalaryObject = await createSalary(user_id, parseFloat(salary));
//         if (!createSalaryObject.successful) {
//             return res.status(400).json({ message: createSalaryObject.error });
//         }

//         // Get salary_id
//         salary_id = await getNewSalaryId();
//     }

//     // NOTE -- Incomes must be an object...
//     // If incomes edit
//     if (incomes) {
//         for (const incomeIndex in incomes) {
//             const currentIncome = incomes[incomeIndex];
//             if (isNaN(currentIncome.income_id) || isNaN(parseFloat(currentIncome.amount))) {
//                 return res.status(400).json({ message: "Invalid type on incomes parameters: income_id or amount." });
//             }
//         }

//         const a = [
//             {
//                 "income_id": 1,
//                 "amount": 2400
//             },
//             {
//                 "income_id": 2,
//                 "amount": 6900
//             }
//         ];

//         // @ts-ignore: Unreachable code error
//         const newIncomeData = await createUserIncome(parseInt(id),);

//         // For a new income
//     }

//     // If outcomes edit

//     // total incomes / outcomes /amount edit

//     // If payment_period_id

//     // Insert into prepayments / prepayroll
//     const prepaymentsEditObject = await editPrePayments(user_id, { salary_id, incomes, total_incomes, outcomes, total_outcomes, total_amount, payment_period_id })
//     if (!prepaymentsEditObject.successful) {
//         return res.status(400).json({ message: prepaymentsEditObject.error });
//     }

//     return res.status(200).json({ message: `Successfully edited prepayroll for user_id: ${user_id} ; row_id: ${id}` });
// });

// Does not edit AUTOMATIC column in outcomes when UPDATING
// SENDING ID MEANS IMPLIES IT EXISTS, SENDING NAME IMPLIES IT DOES NOT
// router.post("/incomes/:id", privileges(Privileges.CREATE_BONUSES, Privileges.READ_BONUSES, Privileges.ASSIGN_BONUSES, Privileges.CREATE_REPORTS), async (req, res) => {
//     // Income_id is optional...
//     let { income_id } = req.body;
//     const { counter, amount, name, automatic } = req.body;
//     const { id } = req.params;

//     if (!name && !income_id) {
//         return res.status(400).json({ message: "Missing either name or income_id." });
//     }

//     if (name && income_id) {
//         return res.status(400).json({ message: "Must not provide name and income_id simultaneously." });
//     }

//     // Required
//     if (!counter || !amount || !automatic) {
//         return res.status(400).json({ message: "Missing parameters." });
//     }

//     // Income entry does not exist, create it AND RETURN ITS ID
//     if (name) {
//         const newIncomeData = await createIncome({ name, automatic, active: true });

//         if (!newIncomeData.successful) {
//             return res.status(400).json({ message: "Invalid request. Entry might be duplicate." });
//         }

//         income_id = await getNewIncomeId();
//     }

//     const newIncomeData = await createUserIncome(parseInt(id), { income_id, counter, amount, automatic });

//     if (!newIncomeData.successful) {
//         return res.sendStatus(500);
//     }

//     if (newIncomeData.updated) {
//         return res.status(200).json({ message: "Income was updated successfully." });
//     }

//     return res.status(200).json({ message: "Income was registered successfully." });
// });

// Change privileges to better matching ones
// Hay manera de invalidar la casilla de name mientras la casilla income_id está habilitada y viceversa?
router.put("/outcomes/:id", privileges(Privileges.CREATE_BONUSES, Privileges.READ_BONUSES, Privileges.ASSIGN_BONUSES, Privileges.CREATE_REPORTS), async (req, res) => {
    // Outcome is optional...
    let { outcome_id } = req.body;
    const { counter, amount, name, automatic } = req.body;
    const { id } = req.params;

    if (!name && !outcome_id) {
        return res.status(400).json({ message: "Missing either name or outcome_id." });
    }

    if (name && outcome_id) {
        return res.status(400).json({ message: "Must not provide name and outcome_id simultaneously." });
    }

    // Required
    if (!counter || !amount || !automatic) {
        return res.status(400).json({ message: "Missing parameters." });
    }

    // Income entry does not exist, create it AND RETURN ITS ID
    if (name) {
        const newOutcomeData = await createOutcome({ name, automatic, active: true });

        if (!newOutcomeData.successful) {
            return res.status(400).json({ message: "Invalid request. Entry might be duplicate." });
        }

        // POSSIBLE BREAK HERE---
        outcome_id = await getNewOutcomeId();
    }

    const newOutcomeData = await createUserOutcome(parseInt(id), { outcome_id, counter, amount, automatic });

    if (!newOutcomeData.successful) {
        return res.sendStatus(500);
    }

    if (newOutcomeData.updated) {
        return res.status(200).json({ message: "Outcome was updated successfully." });
    }

    return res.status(200).json({ message: "Outcome was registered successfully." });
});

router.put("/salary/:user_id", async (req, res) => {
    const { salary } = req.body;
    const { user_id } = req.params;

    if (isNaN(parseFloat(salary)) || parseFloat(salary) <= 0) {
        return res.status(400).json({ message: "Invalid type on salary. Must be a number bigger than 0. " });
    }

    // Create new salary
    const createSalaryObject = await createSalary(parseInt(user_id), parseFloat(salary));
    if (!createSalaryObject.successful) {
        return res.status(400).json({ message: createSalaryObject.error });
    }

    // Get salary_id
    const salary_id = await getNewSalaryId();

    // Edit prepayments
    // let incomes, total_incomes, outcomes, total_outcomes, total_amount, payment_period_id;
    const prepaymentsEditObject = await editPrePayments(parseInt(user_id), { salary_id });
    if (!prepaymentsEditObject.successful) {
        return res.status(400).json({ message: prepaymentsEditObject.error });
    }

    return res.status(200).send({ message: "Successfully changed salary." });
});


export default router;

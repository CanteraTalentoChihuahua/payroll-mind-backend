import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { buildFinalPayrollObject, calculatePayrollMassively, createSalary } from "../controllers/payroll";
import { createIncome, createUserIncome, getNewIncomeId, getAllUsersIncomes, updateIncomesArray, getIncomes } from "../controllers/incomes";
import { createOutcome, createUserOutcome, getNewOutcomeId, getAllUsersOutcomes, updateOutcomesArray, getOutcomes } from "../controllers/outcomes";
import {
    getAllPrePayrolls, getStagedPayrollsLength, pushToPayrolls, pushToPayments, editPrePayments, calculatePayroll,
    bulkInsertIntoPrePayments, bulkInsertIntoPrePayrolls, calculateGlobalPayroll, getNewSalaryId, updatePaymentPeriod,
} from "../controllers/payroll";

import { getAllUsersDataRaw, getUserData } from "../controllers/users";
import { inRange, showing } from "../controllers/general";

const router = express.Router();

// NOTE --- EDIT ON PREPAYROLL FOR DELETING INCOME ID
// NOTE --- ENDPOINT FOR RECALCULATING AND UPLOADING TO PREPAYROLLS


// privileges(Privileges.CREATE_REPORTS, Privileges.READ_REPORTS)

// If pushed... where will they query?

// NEEDS TO CALCULATE FOR NEW USERS
// NOTE - MUST MOVE THIS TO CRONJOB
// Calculates total payroll
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
router.get("/pre", async (req, res) => {
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

// Get individual prepayroll
router.get("/pre/:user_id", async (req, res) => {
    const { user_id } = req.params;

    // Query user and check activity
    const userObject = await getUserData(parseInt(user_id));
    if (!userObject.successful) {
        return res.status(400).send({ message: userObject.error });
    }

    // Query income
    const incomesObject = await getIncomes(parseInt(user_id));
    if (!incomesObject.successful) {
        return res.status(400).send({ message: incomesObject.error });
    }

    // Query outcome
    const outcomesObject = await getOutcomes(parseInt(user_id));
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

// Edit prepayment values
router.put("/pre/:user_id", async (req, res) => {
    // Receive data
    const { user_id } = req.params;

    // Can only edit incomes, 
    const { total_incomes, total_outcomes, total_amount } = req.body;

    // Validations
    if (!total_incomes || !total_outcomes || !total_amount) {
        return res.status(400).json({ message: "Nothing to edit. " });
    }

    const totalArray = [total_incomes, total_outcomes, total_amount];
    totalArray.forEach((total, index) => {
        if (total !== undefined) {
            if (isNaN(parseFloat(total)) || parseFloat(total) < 0) {
                return res.status(400).json({ message: `Invalid data type on: ${totalArray[index]}` });
            }
        }
    });

    // Insert into prepayments / prepayroll
    const prepaymentsEditObject = await editPrePayments(parseInt(user_id), { total_incomes, total_outcomes, total_amount });
    if (!prepaymentsEditObject.successful) {
        return res.status(400).json({ message: prepaymentsEditObject.error });
    }

    return res.status(200).json({ message: `Successfully edited prepayroll for user_id: ${user_id}.` });
});


// Does not edit AUTOMATIC column in outcomes when UPDATING
// SENDING ID MEANS IMPLIES IT EXISTS, SENDING NAME IMPLIES IT DOES NOT
// privileges(Privileges.CREATE_BONUSES, Privileges.READ_BONUSES, Privileges.ASSIGN_BONUSES, Privileges.CREATE_REPORTS)
router.post("/pre/incomes/:user_id", async (req, res) => {
    // outcome_id is optional...
    let { income_id } = req.body;
    const { counter, amount, name, automatic } = req.body;
    const { user_id } = req.params;

    // No request is made
    if (!name && !income_id) {
        return res.status(400).json({ message: "Missing either name or income_id." });
    }

    // This would imply creating something that already exists
    if (name && income_id) {
        return res.status(400).json({ message: "Must not provide name and income_id simultaneously." });
    }

    // Income entry does not exist, create it and return its id
    if (name) {
        // NOTE-- Counter should be assigned automatically
        if (!automatic) {
            return res.status(400).json({ message: "Missing either amount or automatic parameter." });
        }

        const newIncomeData = await createIncome({ name, automatic });
        if (!newIncomeData.successful) {
            return res.status(400).json({ message: newIncomeData.error });
        }

        income_id = await getNewIncomeId();
    }

    // Income entry exists, create a user-income association
    const newIncomeData = await createUserIncome(parseInt(user_id), { income_id, amount, automatic, counter });
    if (!newIncomeData.successful) {
        return res.status(400).json({ message: newIncomeData.error });
    }

    if (newIncomeData.updated) {
        return res.status(200).json({ message: "Income was updated successfully." });
    }

    // Query for incomes_users and update prepayments
    const userIncomeData = await updateIncomesArray(parseInt(user_id));
    if (!userIncomeData.successful) {
        return res.status(400).json({ message: userIncomeData.error });
    }

    return res.status(200).json({ message: "Income was registered successfully. Updated prepayments." });
});

router.put("/pre/outcomes/:user_id", async (req, res) => {
    // outcome_id is optional...
    let { outcome_id } = req.body;
    const { counter, amount, name, automatic } = req.body;
    const { user_id } = req.params;

    if (!name && !outcome_id) {
        return res.status(400).json({ message: "Missing either name or outcome_id." });
    }

    if (name && outcome_id) {
        return res.status(400).json({ message: "Must not provide name and outcome_id simultaneously." });
    }

    // Income entry does not exist, create it AND RETURN ITS ID
    if (name) {
        if (!automatic) {
            return res.status(400).json({ message: "Missing either amount or automatic parameter." });
        }

        const newOutcomeData = await createOutcome({ name, automatic, active: true });
        if (!newOutcomeData.successful) {
            return res.status(400).json({ message: newOutcomeData.error });
        }

        outcome_id = await getNewOutcomeId();
    }


    const newOutcomeData = await createUserOutcome(parseInt(user_id), { outcome_id, counter, amount, automatic });
    if (!newOutcomeData.successful) {
        return res.status(400).json({ message: newOutcomeData.error });
    }

    if (newOutcomeData.updated) {
        return res.status(200).json({ message: "Outcome was updated successfully." });
    }

    // Query for outcomes_users and update prepayments
    const userOutcomeData = await updateOutcomesArray(parseInt(user_id));
    if (!userOutcomeData.successful) {
        return res.status(400).json({ message: userOutcomeData.error });
    }

    return res.status(200).json({ message: "Outcome was registered successfully." });
});

router.put("/pre/salary/:user_id", async (req, res) => {
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

router.put("/pre/payment_period/:user_id", async (req, res) => {
    const { payment_period_id } = req.body;
    const { user_id } = req.params;

    // Validations
    if (!payment_period_id) {
        return res.status(400).json({ message: "Missing payment_period_id" });
    }

    // @ts-ignore: Unreachable code error
    if (isNaN(parseInt(payment_period_id)) || parseInt(payment_period_id) < 0) {
        return res.status(400).json({ message: "Invalid datatype. Must be int and more than 0." });
    }

    const editPaymentObject = await updatePaymentPeriod(payment_period_id, parseInt(user_id));
    if (!editPaymentObject.successful) {
        return res.status(400).json({ message: editPaymentObject.error });
    }

    return res.status(200).json({ message: "Payment period has been changed successfully." });
});

// Moves data from pre_payments to payments
// Ask front to double confirm before calling this endpoint...
// NOTE - IF A CERTAIN TIME PASSES WITH NO CONFIRMATION, CRONJOB SHOULD CALL THIS
router.post("/pre/push", async (req, res) => {
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

export default router;

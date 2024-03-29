import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";

import { buildFinalPayrollObject, calculatePayrollMassively, createSalary } from "../controllers/payroll";
import { createIncome, createUserIncome, getNewIncomeId, getAllUsersIncomes, updateIncomesArray, getCurrentIncomesUsers, deleteAllUsersIncomes } from "../controllers/incomes";
import { createOutcome, createUserOutcome, getNewOutcomeId, getAllUsersOutcomes, updateOutcomesArray, getCurrentOutcomesUsers, deleteAllUsersOutcomes } from "../controllers/outcomes";
import {
    getAllPrePayrolls, getStagedPayrollsLength, pushToPayrolls, pushToPayments, editPrePayments, calculatePayroll,
    bulkInsertIntoPrePayments, bulkInsertIntoPrePayrolls, calculateGlobalPayroll, getNewSalaryId, updatePaymentPeriod,
    getPayments, updateTotals
} from "../controllers/payroll";
import { buildReportObject } from "../controllers/reports";

import { getAllUsersDataRaw, getUserData } from "../controllers/users";
import { createIndicator } from "../controllers/indicators";
import { inRange, showing } from "../controllers/general";

const router = express.Router();

// Calculates total payroll
router.get("/calculate", async (req, res) => {
    // @ts-ignore: Unreachable code error
    const { day } = req.query;

    // New indicators instance is created
    // @ts-ignore: Unreachable code error
    if (parseInt(day) === 1) {
        const indicatorsObject = await createIndicator();
        if (!indicatorsObject.successful) {
            console.log("Getting in?");

            console.log(indicatorsObject.error);
        }
    }

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
    // @ts-ignore: Unreachable code error
    const finalMassivePayrollObject = await calculatePayrollMassively(usersData, incomesData, outcomesData, parseInt(day));
    // Loop through all checking success status
    if (!finalMassivePayrollObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    // Extract final data
    const { comprehensivePayrollObject, brutePayrollObject } = finalMassivePayrollObject;

    // Save into prepayments
    const insertPrePaymentsObject = await bulkInsertIntoPrePayments(comprehensivePayrollObject, true);
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

// Get individual payroll BY DATE 
router.get("/reports/:user_id", async (req, res) => {
    let { initial_date, final_date } = req.body;
    const { user_id } = req.params;

    // Check for offset and limit -- pagination
    let offset = 0, limit = 10;
    if (req.query.limit) {
        // @ts-ignore: Unreachable code error
        limit = parseInt(req.query["limit"]);
    }

    if (req.query.offset) {
        // @ts-ignore: Unreachable code error
        offset = parseInt(req.query["offset"]);
    }

    // Parse dates
    initial_date = new Date(initial_date), final_date = new Date(final_date);

    // Query payments table
    const paymentsObject = await getPayments(parseInt(user_id), { initial_date, final_date }, offset, limit);
    const { userPayments } = paymentsObject;
    if (!paymentsObject.successful) {
        // @ts-ignore: Unreachable code error
        return res.status(400).json({ message: paymentsObject.error });
    }

    // Get user data
    const userDataObject = await getUserData(parseInt(user_id));
    if (!userDataObject.successful) {
        return res.status(400).json({ message: userDataObject.error });
    }

    // Extract data 
    const { userData } = userDataObject;
    const payroll_schema = userData["payroll_schema.name"], payments_periods = userData["payments_period.name"];

    // Get comprehensive report object
    const reportObject = await buildReportObject({ payroll_schema, payments_periods }, userPayments);
    if (!paymentsObject.successful) {
        // @ts-ignore: Unreachable code error
        return res.status(400).json({ message: paymentsObject.error });
    }

    const { reportArray } = reportObject;
    return res.status(200).json(reportArray);
});


// Query pre_payments
// MUST SPECIFY 15TH OR 31TH PAYROLL... ?payroll=mid or payroll=end
router.get("/pre", async (req, res) => {
    // Payroll request...
    const specificPayroll = req.query.payroll;

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

    if (specificPayroll !== "mid" && specificPayroll !== "end" || !specificPayroll) {
        return res.status(400).json({ message: "Unable to process request. Specify for 'mid' or 'end' payroll." });
    }

    // Query payroll data
    const payrollObject = await getAllPrePayrolls(specificPayroll, offset, limit);
    if (!payrollObject.successful) {
        return res.status(400).json({ message: payrollObject.error });
    }

    // Build payroll object
    const { payrollData } = payrollObject;
    const finalPayrollObject = await buildFinalPayrollObject(payrollData);
    if (!finalPayrollObject.successful) {
        // @ts-ignore: Unreachable code error
        return res.status(400).json({ message: finalPayrollObject.error });
    }

    // Query total user amount
    const payrollLengthObject = await getStagedPayrollsLength(specificPayroll);
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

// Get individual prepayroll BY CURRENT
router.get("/pre/:user_id", async (req, res) => {
    const { user_id } = req.params;

    // Query user and check activity
    const userObject = await getUserData(parseInt(user_id));
    if (!userObject.successful) {
        return res.status(400).send({ message: userObject.error });
    }

    // Query income
    const incomesObject = await getCurrentIncomesUsers(parseInt(user_id));
    if (!incomesObject.successful) {
        return res.status(400).send({ message: incomesObject.error });
    }

    // Query outcome
    const outcomesObject = await getCurrentOutcomesUsers(parseInt(user_id));
    if (!outcomesObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    // Extract values
    const { userData } = userObject;
    const { incomesData } = incomesObject;
    const { outcomesData } = outcomesObject;
    const salary = userData["salary.salary"];

    // Calculate payroll
    const payroll = await calculatePayroll(parseFloat(salary), incomesData, outcomesData);

    // Build final JSON object
    const finalPayrollObject = {
        payroll_schema: userData["payroll_schema.name"],
        payment_period: userData["payments_period.name"],
        salary: salary,
        incomes: incomesData,
        outcomes: outcomesData,
        payrollTotal: payroll
    };

    // Build name object
    return res.status(200).send({
        nameObject: {
            first_name: userData["first_name"],
            second_name: userData["second_name"],
            last_name: userData["last_name"],
            second_last_name: userData["second_last_name"]
        },
        finalPayrollObject
    });
});

// Edit prepayment values
router.put("/pre/total/:user_id", async (req, res) => {
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
router.put("/pre/incomes/:user_id", async (req, res) => {
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

router.put("/pre/total/:user_id", async (req, res) => {
    const { total_incomes, total_outcomes, total_amount } = req.body;
    const { user_id } = req.params;

    if (!total_incomes || !total_amount || !total_outcomes) {
        return res.status(400).json({ message: "Missing any of the following parameters: total_incomes, total_outcomes, total_amount." })
    }

    const totalUpdateObject = await updateTotals(parseInt(user_id), { total_incomes, total_outcomes, total_amount });
    if (!totalUpdateObject.successful) {
        return res.status(400).send({ message: totalUpdateObject.error });
    }

    return res.status(200).json({ message: "Successfully updated totals." });
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

    // Delete every income / outcome
    await deleteAllUsersIncomes();
    await deleteAllUsersOutcomes();

    return res.status(200).json({ message: "Successfully registered payments." });
});

export default router;

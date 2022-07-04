import express from "express";
import { createIncome, createOutcome, createUserIncome, createUserOutcome, getIncomesLength, getOutcomesLength } from "../controllers/incomes";
import { getUserData, getSalary, getIncomes, getOutcomes, calculatePayroll } from "../controllers/payroll";

const router = express.Router();

// privileges(Privileges.READ_REPORTS)
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    // Query user and check activity
    const userDataObject = await getUserData(parseInt(id));

    if (!userDataObject.successful) {
        return res.status(404).json({ message: "No user found." });
    }

    // Query incomes-users
    const incomesDataObject = await getIncomes(parseInt(id));
    if (!incomesDataObject.successful) {
        return res.sendStatus(500);
    }

    // Query outcomes-users
    const outcomesDataObject = await getOutcomes(parseInt(id));
    if (!outcomesDataObject.successful) {
        return res.sendStatus(500);
    }

    // Query salary
    const salaryDataObject = await getSalary(parseInt(id));
    if (!salaryDataObject.successful) {
        return res.sendStatus(500);
    }

    // Payroll sum total
    const { incomesObject } = incomesDataObject;
    const { outcomesObject } = outcomesDataObject;
    const { salary } = salaryDataObject.salaryData[0];

    // Final payroll value
    const payrollTotal = await calculatePayroll(incomesObject, outcomesObject, parseFloat(salary));

    // Build JSON object
    const payrollObject = {
        incomes: incomesObject,
        outcomes: outcomesObject,
        salary: parseFloat(salary),
        total: payrollTotal
    };

    res.status(200).send(payrollObject);
});

// Dropdown con incomes
router.post("/incomes/:id", async (req, res) => {
    // Income_id is optional...
    let { income_id } = req.body;
    const { counter, amount, name, automatic } = req.body;
    const { id } = req.params;

    if (!name && !income_id) {
        return res.status(400).json({ message: "Missing either name or income_id." });
    }

    if (name && income_id) {
        return res.status(400).json({ message: "Must not provide name and income_id simultaneously." });
    }

    // Required
    if (!counter || !amount || !automatic) {
        return res.status(400).json({ message: "Missing parameters." });
    }

    // Income entry does not exist, create it AND RETURN ITS ID
    if (name) {
        const newIncomeData = await createIncome({ name, automatic, active: true });

        if (!newIncomeData.successful) {
            return res.status(400).json({ message: "Invalid request. Entry might be duplicate." });
        }

        income_id = await getIncomesLength();
    }

    const newIncomeData = await createUserIncome(parseInt(id), { income_id, counter, amount, automatic });

    if (!newIncomeData.successful) {
        return res.sendStatus(500);
    }

    if (newIncomeData.updated) {
        return res.status(200).json({ message: "Income was updated successfully." });
    }

    return res.status(200).json({ message: "Income was registered successfully." });
});

// Dropdown con outcomes
router.post("/outcomes/:id", async (req, res) => {
    // Income_id is optional...
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

        outcome_id = await getOutcomesLength();
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

router.post("/trial", async (req, res) => {
    getIncomesLength();
});

export default router;

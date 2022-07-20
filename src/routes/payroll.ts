import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { calculatePayrollMassively, createSalary } from "../controllers/payroll";
import { createIncome, createUserIncome, getNewIncomeId, getIncomes, getAllUsersIncomes, createRange } from "../controllers/incomes";
import { createOutcome, createUserOutcome, getNewOutcomeId, getOutcomes, getAllUsersOutcomes } from "../controllers/outcomes";
import { getUserData, getAllUsersData, calculatePayroll } from "../controllers/payroll";
import { trialFunction } from "../controllers/users";

const router = express.Router();

router.get("/something", async (req, res) => {
    const data = await trialFunction();
    return res.status(200).send(data);
});



// Calculates total payroll
router.get("/all", privileges(Privileges.CREATE_REPORTS, Privileges.READ_REPORTS), async (req, res) => {
    // Check business unit logic
    let offset, limit;
    if (req.query && req.query.limit) {
        // @ts-ignore: Unreachable code error
        offset = parseInt(req.query["offset"]);
        // @ts-ignore: Unreachable code error
        limit = parseInt(req.query["limit"]);

    } else {
        return res.status(400).json({ message: "Missing limit parameters." });
    }

    if (!req.query.offset) {
        offset = 0;
    }

    // Query users and check activity
    // @ts-ignore: Unreachable code error
    const usersObject = await getAllUsersData(offset, limit);
    if (!usersObject.successful) {
        return res.status(400).json({ message: usersObject.error });
    }

    // Generate range
    // @ts-ignore: Unreachable code error
    const idRange = createRange(limit, offset);

    // Query income
    const incomesObject = await getAllUsersIncomes(idRange);
    if (!incomesObject.successful) {
        return res.status(400).send({ message: incomesObject.error });
    }

    // Query outcome
    const outcomesObject = await getAllUsersOutcomes(idRange);
    if (!outcomesObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    // Extract values -- must be done individually
    const { usersData } = usersObject;
    const { incomesData } = incomesObject;
    const { outcomesData } = outcomesObject;
    // const { salary } = usersData["salary"];

    // Calculate payroll massively
    const finalMassivePayrollObject = await calculatePayrollMassively(usersData, incomesData, outcomesData);
    // Loop through all checking success status
    if (!finalMassivePayrollObject.successful) {
        return res.status(400).send({ message: outcomesObject.error });
    }

    return res.status(200).send({
        massivePayroll: finalMassivePayrollObject.finalMassivePayroll,
        massivePayrollTotal: finalMassivePayrollObject.massivePayrollTotal
    });
});


//////
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

// Does not edit AUTOMATIC column in outcomes when UPDATING
// SENDING ID MEANS IMPLIES IT EXISTS, SENDING NAME IMPLIES IT DOES NOT
router.post("/incomes/:id", privileges(Privileges.CREATE_BONUSES, Privileges.READ_BONUSES, Privileges.ASSIGN_BONUSES, Privileges.CREATE_REPORTS), async (req, res) => {
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

        income_id = await getNewIncomeId();
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

// Change privileges to better matching ones
// Hay manera de invalidar la casilla de name mientras la casilla income_id está habilitada y viceversa?
router.post("/outcomes/:id", privileges(Privileges.CREATE_BONUSES, Privileges.READ_BONUSES, Privileges.ASSIGN_BONUSES, Privileges.CREATE_REPORTS), async (req, res) => {
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

router.post("/salary/:id", async (req, res) => {
    const { salary } = req.body;
    const { id } = req.params;

    try {
        await createSalary(parseInt(id), parseFloat(salary));

    } catch (error) {
        return res.status(400).json({ message: "Unable to update salary." });
    }

    return res.status(200).send({ message: "Successfully changed salary." });
});


export default router;

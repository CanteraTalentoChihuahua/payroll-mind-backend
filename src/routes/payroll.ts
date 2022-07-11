import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { createSalary } from "../controllers/payroll";
import { createIncome, createUserIncome, getNewIncomeId, getIncomes, incomesObj } from "../controllers/incomes";
import { createOutcome, createUserOutcome, getNewOutcomeId, getOutcomes, outcomesObj } from "../controllers/outcomes";
import { getUserData, getSalary, calculatePayroll } from "../controllers/payroll";

const router = express.Router();

router.get("/:id", privileges(Privileges.CREATE_REPORTS, Privileges.READ_REPORTS), async (req, res) => {
    const { id } = req.params;

    // Query user and check activity
    const userDataObject = await getUserData(parseInt(id));

    if (!userDataObject.successful) {
        return res.status(404).json({ message: "No user found." });
    }

    // Query salary
    const salaryDataObject = await getSalary(parseInt(id));
    if (!salaryDataObject.successful) {
        return res.status(400).send("Invalid request. User is missing salary.");
    }

    // Query incomes-users
    const incomesDataObject = await getIncomes(parseInt(id));
    let incomesList: incomesObj[] | undefined = [];

    // No associated incomes found
    if (!incomesDataObject.successful) {
        // Invalid query
        if (incomesDataObject.error) {
            return res.sendStatus(500);
        }

        incomesList = [{
            income_id: undefined,
            counter: undefined,
            amount: undefined,
            name: undefined,
            automatic: undefined
        }];
    }

    // Query outcomes-users
    const outcomesDataObject = await getOutcomes(parseInt(id));
    let outcomesList: outcomesObj[] | undefined = [];

    // No associated outcomes found
    if (!outcomesDataObject.successful) {
        // Invalid query
        if (outcomesDataObject.error) {
            return res.sendStatus(500);
        }

        outcomesList = [{
            outcome_id: undefined,
            counter: undefined,
            amount: undefined,
            name: undefined,
            automatic: undefined
        }];
    }

    // Payroll sum total --SALARY IS REQUIRED
    const salary = salaryDataObject.salaryData.salary;

    // Associated incomes exist
    if (!incomesList.length) {
        incomesList = incomesDataObject.incomesObject;
    }

    // Associated outcomes exist
    if (!outcomesList.length) {
        outcomesList = outcomesDataObject.outcomesObject;
    }

    // Final payroll value
    const { payrollTotal, incomesTotal, outcomesTotal } = await calculatePayroll(parseFloat(salary), incomesList, outcomesList);

    // Build JSON object
    const { payment_period_id } = userDataObject.userData;
    const payrollObject: unknown = {
        payment_period_id,
        incomes: incomesList,
        outcomes: outcomesList,
        salary: parseFloat(salary),
        total: {
            incomesTotal,
            outcomesTotal,
            payrollTotal
        }
    };

    return res.status(200).send(payrollObject);
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
// Dropdown con outcomes?
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


// MASSIVE PAYROLL REQUEST
// Limit via query and business units
// router.get("/attempt/trial", privileges(Privileges.READ_REPORTS), async (req, res) => {
//     // Get all business units from user
//     const { business_unit, role_id } = res.locals.userInfo;
//     const { business_unit_ids } = business_unit;

//     const role = await getRoleName(role_id);

//     // Get all user_ids under current user business unit
//     let userIdData;
//     if (role === "admin") {
//         userIdData = await getIdsUnderBusinessUnit(business_unit_ids);
//     } else {
//         userIdData = await getIdsUnderBusinessUnit();
//     }

//     const userList = createList(userIdData.userList);

//     // Query user and check activity
//     const userData = await getMassiveUserData(userList);

//     // Query salary
//     const salaryDataObject = await getMassiveSalary(userList);

//     // Query incomes-users
//     const incomesDataObject = await getMassiveIncomes(userList);
//     // let incomesList: incomesObj[] | undefined = [];

//     // No associated incomes found
//     // if (!incomesDataObject.successful) {
//     //     // Invalid query
//     //     if (incomesDataObject.error) {
//     //         return res.sendStatus(500);
//     //     }

//     //     incomesList = [{
//     //         income_id: undefined,
//     //         counter: undefined,
//     //         amount: undefined,
//     //         name: undefined,
//     //         automatic: undefined
//     //     }];
//     // }

//     return res.status(200).send(incomesDataObject);
// });



export default router;

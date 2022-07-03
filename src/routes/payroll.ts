import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { getUserData, getSalary, getIncomes, getOutcomes, calculatePayroll } from "../controllers/payroll";
import incomes from "../database/models/incomes";

const router = express.Router();

// privileges(Privileges.READ_REPORTS)
router.get("/payroll/:id", async (req, res) => {
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

export default router;

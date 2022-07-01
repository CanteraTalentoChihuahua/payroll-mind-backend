import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { templateFunction, getIncomes } from "../controllers/payroll";

const router = express.Router();

router.get("/payroll/:id", privileges(Privileges.READ_REPORTS), async (req, res) => {
    const { id } = req.params;

    // Query user and check activity
    const userDataObject = await getIncomes(parseInt(id));
    const { incomesObject } = userDataObject;

    if (!incomesObject) {
        return res.status(404).json({ message: "No user found." });
    }

    console.log(incomesObject);

    // Query incomes-users

    // Query outcomes-users

    // Sum total

    // Build final object (id, name, amount for each entry ; sum total)

    // Send final JSON 

    if (!userDataObject.successful) {
        return res.status(400).send("An error occured.");
    }

    const payrollObject = {
        "incomes": {},
        "outcomes": {},
        "salary": {},
        "sum_total": {}
    };

    return res.status(200).send(payrollObject);
});

export default router;

import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { getUserData, getIncomes, getOutcomes } from "../controllers/payroll";
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

    const { userData } = userDataObject;

    // Query incomes-users
    const incomesDataObject = await getIncomes(parseInt(id));
    const { incomesObject } = incomesDataObject;

    if (!incomesDataObject.successful) {
        return res.sendStatus(500);
    }

    // Query outcomes-users
    const outcomesDataObject = await getOutcomes(parseInt(id));
    const { outcomesObject } = outcomesDataObject;

    if (!outcomesDataObject.successful) {
        return res.sendStatus(500);
    }

    res.status(200).send([incomesObject, outcomesObject]);

    // Sum total

    // Build final object (id, name, amount for each entry ; sum total)

    // Send final JSON 

    // if (!userDataObject.successful) {
    //     return res.status(400).send("An error occured.");
    // }

    // const payrollObject = {
    //     "incomes": {},
    //     "outcomes": {},
    //     "salary": {},
    //     "sum_total": {}
    // };

    // return res.status(200).send(payrollObject);
});

export default router;

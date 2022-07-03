import express from "express";
import { Privileges } from "../util/objects";
import privileges from "../middleware/privileges";
import { getUserData, getIncomes } from "../controllers/payroll";
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
    const incomesObject = await getIncomes(parseInt(id));
    res.status(200).json(incomesObject);

    // Query outcomes-users

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

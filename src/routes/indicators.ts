import express from "express";
import { calculateGlobalPayroll } from "../controllers/payroll";

const router = express.Router();

// New users
router.get("/new_collabs", async (req, res) => {
    // @ts-ignore: Unreachable code errors
    const { initial_date, final_date } = req.params;

    if (!initial_date && !final_date) {
        return res.status(400).json({ message: "Missing any of the following parameters: initial_date, final_date." });
    }

    // Parse dates 
    const dateObject = {
        initial_date: new Date(initial_date),
        final_date: new Date(final_date)
    };

    // Query users
    const newUsersObject = getNewUsers(dateObject);
    if (!newUsersObject.successful) {
        return res.status(200).json({ message: newUsersObject.error });
    }

    return res.status(200).send(newUsersObject.newUsers);
});

// Fired users
router.get("/inactive_collabs", async (req, res) => {

});

// Payroll total per 15 or 30
// Calculate global
router.get("/calculate/global", async (req, res) => {
    const globalPayrollObject = await calculateGlobalPayroll();
    if (!globalPayrollObject.successful) {
        return res.status(400).json({ message: globalPayrollObject.error });
    }

    return res.status(200).send({ globalPayrollTotal: globalPayrollObject.globalPayrollTotal });
});

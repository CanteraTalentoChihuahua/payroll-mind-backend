import express from "express";
import { calculateGlobalPayroll } from "../controllers/payroll";
// import { getNewUsers } from "../controllers/indicators ";

const router = express.Router();

// New users
router.get("/new_collabs", async (req, res) => {
    // @ts-ignore: Unreachable code errors
    const { month, year } = req.query;

    if (!month && !year) {
        return res.status(400).json({ message: "Missing any of the following parameters: month, year." });
    }

    // Query users
    // const newUsersObject = getNewUsers(month, year);
    // if (!newUsersObject.successful) {
    //     return res.status(200).json({ message: newUsersObject.error });
    // }

    // return res.status(200).send(newUsersObject.newUsers);
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

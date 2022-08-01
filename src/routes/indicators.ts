import express from "express";
import { calculateGlobalPayroll } from "../controllers/payroll";
import { getUserIndicators, updateNewUsers } from "../controllers/indicators";

const router = express.Router();

router.get("/trial/:aaa", async (req, res) => {
    const { aaa } = req.params;
    await updateNewUsers(parseInt(aaa));

    return res.status(200).json({ message: "aaa" });
});

// New users and fired users
router.get("/new_collabs", async (req, res) => {
    // @ts-ignore: Unreachable code errors
    const { month, year, counter } = req.query;

    if (!month && !year) {
        return res.status(400).json({ message: "Missing any of the following parameters: month, year." });
    }

    // Query new users
    // @ts-ignore: Unreachable code errors
    const newUsersObject = await getNewUsers(month, year);
    if (!newUsersObject.successful) {
        return res.status(400).json({ message: newUsersObject.error });
    }

    // Query inactive users
    const inactiveUsersObject = await getInactiveUsers()
    if (!inactiveUsersObject.successful)  {
        return res.status(400).json({ message: inactiveUsersObject.error });
    }

    const { newUsers } = newUsersObject;
    if (counter) {
        // @ts-ignore: Unreachable code errors
        const { new_users } = newUsers;
        return res.status(200).json({
            new_users_length: new_users["new_users"].length
        });
    }

    return res.status(200).send(newUsersObject.newUsers);
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


export default router;

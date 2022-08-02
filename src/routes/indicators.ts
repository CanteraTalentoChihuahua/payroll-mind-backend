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
router.get("/users", async (req, res) => {
    // @ts-ignore: Unreachable code errors
    const { month, year, counter } = req.query;

    if (!month && !year) {
        return res.status(400).json({ message: "Missing any of the following parameters: month, year." });
    }

    // Query new users
    // @ts-ignore: Unreachable code errors
    const usersIndicatorObject = await getUserIndicators(month, year);
    if (!usersIndicatorObject.successful) {
        return res.status(400).json({ message: usersIndicatorObject.error });
    }

    const { usersIndicators } = usersIndicatorObject;
    const indicatorObject = {
        new_users: 0,
        inactive_users: 0
    };

    if (counter && usersIndicators.length !== []) {
        // @ts-ignore: Unreachable code errors
        const { new_users, inactive_users } = usersIndicators;

        try {
            indicatorObject["new_users"] = new_users["new_users"].length;
        } catch (error) {
            console.log("No new users.");
        }

        try {
            indicatorObject["inactive_users"] = inactive_users["inactive_users"].length;
        } catch (error) {
            console.log("No new inactive users.");
        }
    }

    return res.status(200).send(indicatorObject);
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

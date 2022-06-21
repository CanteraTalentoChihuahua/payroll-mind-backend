import { getPaymentPeriods } from "../controllers/info";
import { Privileges } from "../util/objects";
import express from "express";

const router = express.Router();

// Informative
router.get("/privileges", async (req, res) => {
    try {
        return res.status(200).send(Privileges);

    } catch (error) {
        return res.status(503).json({ message: "Unable to send privileges." });
    }
});

router.get("/paymentperiods", async (req, res) => {
    const businessUnitData = await getPaymentPeriods();

    if (businessUnitData === false) {
        return res.status(400).send("Invalid request.");
    }

    return res.status(200).send(businessUnitData);
});

export default router;
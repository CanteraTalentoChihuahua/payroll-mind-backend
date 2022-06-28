import { getBusinessUnits, getPaymentPeriods, getSalaries, getPayrollSchemas, getRoles } from "../controllers/info";
import { Privileges } from "../util/objects";
import express from "express";

// Missing ROLES ROUTE
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
    const paymentPeriodsData = await getPaymentPeriods();

    if (!paymentPeriodsData) {
        return res.status(400).send("Invalid request.");
    }

    return res.status(200).send(paymentPeriodsData);
});

router.get("/roles", async (req, res) => {
    const rolesData = await getRoles();

    if (!rolesData) {
        return res.status(400).send("Invalid request.");
    }

    return res.status(200).send(rolesData);
});

router.get("/salaries", async (req, res) => {
    const salaryData = await getSalaries();

    if (!salaryData) {
        return res.status(400).send("Invalid request.");
    }

    return res.status(200).send(salaryData);
});

router.get("/businessunits", async (req, res) => {
    const businessUnitsData = await getBusinessUnits();

    if (!businessUnitsData) {
        return res.status(400).send("Invalid request.");
    }

    return res.status(200).send(businessUnitsData);
});

router.get("/payrollschemas", async (req, res) => {
    const payrollSchemasData = await getPayrollSchemas();

    if (!payrollSchemasData) {
        return res.status(400).send("Invalid request.");
    }

    return res.status(200).send(payrollSchemasData);
});


export default router;

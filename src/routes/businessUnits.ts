import express, { query } from "express";
import { find, save } from "../controllers/businessUnits";
import db from "../database/database";
const businessUnits = require("../database/models/business_units")(db);

// MISSING CREDENTIALS --Auth middleware

const businessUnitRouter = express.Router();

businessUnitRouter.get("/list", async (req, res) => {
    const businessUnitsData = await businessUnits.findAll()

    if (businessUnitsData === null) {
        res.status(204).send("No business unit found.");
    } else {
        res.status(200).send(businessUnitsData);
    }
});

businessUnitRouter.get("/list/:id", async (req, res) => {
    const { id } = req.params;
    const businessUnitsData = await businessUnits.find(id);

    if (businessUnitsData === null) {
        res.status(204).send("No business unit found.");
    } else {
        res.status(200).send(businessUnitsData);
    }
});


businessUnitRouter.post("/save", async (req, res) => {
    const { name } = req.body;

    const BusinessUnitName = await find(name);
    if (BusinessUnitName) return res.status(409).json({ message: `Business unit "${name}" already exists.` });

    try {
        await save(name);
        return res.status(200).json({
            message: `Business unit "${name}" was created successfully.`
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Something went wrong. Unable to create business unit "${name}".`
        });
    }
});

export default businessUnitRouter;
import db from "../database/database";
import express, { query, response } from "express";
import { find, save } from "../controllers/businessUnits";
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
    const businessUnitsData = await businessUnits.findOne({
        where: { id }
    });

    if (businessUnitsData === null) {
        res.status(204).send("No business unit found.");
    } else {
        res.status(200).send(businessUnitsData);
    }
});

businessUnitRouter.put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    const businessUnitsData = await businessUnits.findOne({
        where: { id }
    });

    if (businessUnitsData === null) {
        res.status(204).send("No business unit found.");

    } else {
        try {
            const prevName = businessUnitsData.name;
            await businessUnits.update({ name: newName }, {
                where: { id }
            });

            return res.status(200).json({
                message: `Successs. Updated "${prevName}" business unit name to "${newName}".`
            });

        } catch (error) {
            return res.status(500).json({
                message: "Something went wrong. Unable to cast changes."
            });
        }
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

businessUnitRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    const businessUnitsData = await businessUnits.findOne({
        where: { id }
    });

    if (businessUnitsData === null) {
        return res.status(204).json({
            message: "No business unit found."
        });

    } else {
        try {
            await businessUnits.destroy({
                where: { id }
            });

            return res.status(200).json({
                message: "Business unit was deleted successfully."
            });

        } catch (error) {
            return res.status(500).json({
                message: "Unable to delete business unit."
            });
        }
    }
});

export default businessUnitRouter;
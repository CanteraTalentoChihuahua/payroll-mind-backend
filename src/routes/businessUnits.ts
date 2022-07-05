import express from "express";
import db from "../database/database";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";
import { saveBusinessUnit, findAllBusinessUnits, findBusinessUnitById, findBusinessUnitByName } from "../controllers/businessUnits";
const businessUnits = require("../database/models/business_units")(db);

const businessUnitRouter = express.Router();

businessUnitRouter.get("/list", privileges(Privileges.READ_BUSINESS_UNITS), async (req, res) => {
    const businessUnitsData = await findAllBusinessUnits();

    return (businessUnitsData === null) ?
        res.status(404).json({ message: "No business unit found." }) :
        res.status(200).send(businessUnitsData);
});

businessUnitRouter.get("/list/:id", privileges(Privileges.READ_BUSINESS_UNITS), async (req, res) => {
    const { id } = req.params;
    const businessUnitsData = await findBusinessUnitById(id);

    return (businessUnitsData === null) ?
        res.status(404).json({ message: "No business unit found." }) :
        res.status(200).send(businessUnitsData);
});

businessUnitRouter.put("/edit/:id", privileges(Privileges.EDIT_BUSINESS_UNITS, Privileges.REACTIVATE_BUSINESS_UNITS), async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    const businessUnitsData = await findBusinessUnitById(id);

    if (businessUnitsData === null) {
        return res.status(404).json({
            message: "No business unit found."
        });
    }

    try {
        const prevName = businessUnitsData.name;
        await businessUnits.update({ name: newName }, {
            where: { id }
        });

        return res.status(200).json({
            message: `Successs. Updated "${prevName}" business unit name to "${newName}".`
        });

    } catch (error) {
        return res.status(503).json({
            message: "Something went wrong. Unable to cast changes."
        });
    }
});

businessUnitRouter.post("/save", privileges(Privileges.CREATE_BUSINESS_UNITS), async (req, res) => {
    const { name } = req.body;

    const BusinessUnitName = await findBusinessUnitByName(name);
    if (BusinessUnitName) return res.status(409).json({ message: `Business unit "${name}" already exists.` });

    try {
        await saveBusinessUnit(name);
        return res.status(200).json({
            message: `Business unit "${name}" was created successfully.`
        });

    } catch (error) {
        return res.status(503).json({
            message: `Something went wrong. Unable to create business unit "${name}".`
        });
    }
});

businessUnitRouter.delete("/delete/:id", privileges(Privileges.DELETE_BUSINESS_UNITS), async (req, res) => {
    const { id } = req.params;
    const businessUnitsData = await findBusinessUnitById(id);

    if (businessUnitsData === null) {
        return res.status(404).json({
            message: "No business unit found."
        });
    }

    try {
        await businessUnits.destroy({
            where: { id }
        });

        return res.status(200).json({
            message: "Business unit was deleted successfully."
        });

    } catch (error) {
        return res.status(503).json({
            message: "Unable to delete business unit."
        });
    }
});

export default businessUnitRouter;

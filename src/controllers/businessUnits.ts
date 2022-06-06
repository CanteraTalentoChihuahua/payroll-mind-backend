import db from "../database/database";
const businessUnits = require("../database/models/business_units")(db);
//Se necesita una token para jwt

async function saveBusinessUnit(name: string) {
    await businessUnits.create({
        name: name
    });
};

async function findBusinessUnitByName(name: string) {
    const businessUnit = await businessUnits.findOne({
        where: { name }
    });
    return businessUnit;
};

async function findBusinessUnitById(id: string) {
    const businessUnit = await businessUnits.findOne({
        where: { id: parseInt(id) }
    });
    return businessUnit;
};

async function findAllBusinessUnits() {
    const businessUnitsData = await businessUnits.findAll();
    return businessUnitsData;
} 


export { saveBusinessUnit, findBusinessUnitByName,
         findBusinessUnitById, findAllBusinessUnits };
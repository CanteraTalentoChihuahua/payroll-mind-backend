import db from "../database/database";
const business_units = require("../database/models/business_units")(db);
//Se necesita una token para jwt

async function save(name: string) {
    await business_units.create({
        name: name
    });
};

async function find(name: string) {
    const businessUnitName = await business_units.findOne({
        where: { name }
    });
    return businessUnitName;
};


export { save, find };

import db from "../database/database";
const business_units = require("../database/models/business_units")(db);
//Se necesita una token para jwt


async function save(name: string) {
    await business_units.create({
        name:name
    });    
    };

    async function find(name: string) {
        const BusinessUnitName = await business_units.findOne({
            where: {name}
        
        });    
        return BusinessUnitName;
    };

    

    export  {save, find};

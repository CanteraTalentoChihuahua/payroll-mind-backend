import db from "../database/database";
const business_units = require("../database/models/business_units")(db);
//Se necesita una token para jwt


async function save(name: string) {
    const nameBusinessUnit = await business_units.create({
        name:name
    });    
    };

    async function edit(name: string) {
        const nameBusinessUnit = await business_units.edit({
            name:name
        });    
        };

    

    export  {save, edit};

import db from "../database/database";
const businessUnits = require("../database/models/payments_periods")(db);

// Alphanumeric
export async function generatePassword(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

export async function getPaymentPeriods() {
    let businessUnitData;

    try {
        businessUnitData = await businessUnits.findAll();
        
    } catch (error) {
        return false;
    }

    return businessUnitData;
}

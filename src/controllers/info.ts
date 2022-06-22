import db from "../database/database";
const roles = require("../database/models/roles")(db);
const businessUnits = require("../database/models/payments_periods")(db);

export async function getPaymentPeriods() {
    let businessUnitData;

    try {
        businessUnitData = await businessUnits.findAll();

    } catch (error) {
        return false;
    }

    return businessUnitData;
}

export async function getRoles() {
    let rolesData;

    try {
        rolesData = await roles.findAll();

    } catch (error) {
        return false;
    }

    return rolesData;
}

import db from "../database/database";
const roles = require("../database/models/roles")(db);
const salaries = require("../database/models/salaries")(db);
const businessUnits = require("../database/models/business_units")(db);
const paymentPeriods = require("../database/models/payments_periods")(db);
const payrollSchemas = require("../database/models/payroll_schemas")(db);


export async function getPaymentPeriods() {
    let paymentPeriodsData;

    try {
        paymentPeriodsData = await paymentPeriods.findAll();

    } catch (error) {
        return false;
    }

    return paymentPeriodsData;
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

export async function getSalaries() {
    let salaryData;

    try {
        salaryData = await salaries.findAll();

    } catch (error) {
        return false;
    }

    return salaryData;
}

export async function getBusinessUnits() {
    let businessUnitsData;

    try {
        businessUnitsData = await businessUnits.findAll();

    } catch (error) {
        return false;
    }

    return businessUnitsData;
}

export async function getPayrollSchemas() {
    let payrollSchemaData;

    try {
        payrollSchemaData = await payrollSchemas.findAll();

    } catch (error) {
        return false;
    }

    return payrollSchemaData;
}

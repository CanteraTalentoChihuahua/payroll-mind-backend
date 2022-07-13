const { roles, incomes, outcomes, salaries, business_units: businessUnits, payments_periods: paymentPeriods, payroll_schemas: payrollSchemas } = require("../database/models/index");

export async function getIncomes() {
    let incomesData;

    try {
        incomesData = await incomes.findAll();

    } catch (error) {
        return false;
    }

    return incomesData;
}

export async function getOutcomes() {
    let outcomesData;

    try {
        outcomesData = await outcomes.findAll();

    } catch (error) {
        return false;
    }

    return outcomesData;
}

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

import { getUsersIncomes } from "./incomes";
import { getUsersOutcomes } from "./outcomes";

export async function buildReportObject(additionalData: unknown, paymentsArray: unknown) {
    const reportArray: unknown[] = [];

    // @ts-ignore: Unreachable code error
    for (const paymentIndex in paymentsArray) {
        // @ts-ignore: Unreachable code error
        const currentPayment = paymentsArray[paymentIndex];

        const { outcomes } = currentPayment["outcomes"];
        const { incomes } = currentPayment["incomes"];

        // Query incomes
        const incomesObject = await getUsersIncomes(incomes);
        if (!incomesObject.successful) {
            if (!incomesObject.error) {
                return { successful: false, error: incomesObject.error };
            }
        }

        // Query outcomes
        const outcomesObject = await getUsersOutcomes(outcomes);
        console.log(outcomes);

        if (!outcomesObject.successful) {
            if (!outcomesObject.error) {
                return { successful: false, error: outcomesObject.error };
            }
        }

        // Extract data
        const { incomesArray } = incomesObject;
        const { outcomesArray } = outcomesObject;

        const comprehensivePaymentObject = {
            payment_id: currentPayment.id,
            user_id: currentPayment.user_id,

            // @ts-ignore: Unreachable code error
            payroll_schema: additionalData["payroll_schema"],
            // @ts-ignore: Unreachable code error
            payment_period: additionalData["payments_periods"],
            payment_date: currentPayment.payment_date,

            salary: currentPayment.salary,
            incomes: incomesArray,
            outcomes: outcomesArray,
            payrollTotal: {
                payrollTotal: parseFloat(currentPayment.total_amount),
                incomesTotal: parseFloat(currentPayment.total_incomes),
                outcomesTotal: parseFloat(currentPayment.total_outcomes)
            }
        };

        reportArray.push(comprehensivePaymentObject);
    }

    return { successful: true, reportArray };
}

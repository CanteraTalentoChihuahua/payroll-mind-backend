"use strict";


module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addConstraint("payments", {
            fields: ["payment_period_id"],
            name: "paymentsPeriods_payments_association",
            type:"foreign key",
            references: {
                table: "payments_periods",
                field: "id"
            }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeConstraint("payments","paymentsPeriods_payments_association");
    }
};

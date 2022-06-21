"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("users", {
            fields: ["payment_period_id"],
            name: "users_paymentsperiods_association",
            type: "foreign key",
            references: {
                table: "payments_periods",
                field: "id"
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("users", "users_paymentsperiods_association");

    }
};

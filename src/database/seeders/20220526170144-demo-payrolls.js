"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("payrolls", [{
            payment_date: "2022-06-01",
            payment_period_id: 1,
            business_unit_id: 1,
            total_amount: 12354.23
        },]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payrolls", null, {});
    }
};

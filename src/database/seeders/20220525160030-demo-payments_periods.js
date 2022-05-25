"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("payments_periods", [{
            id: 1,
            name: "Semanal",
        }]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("business_units", null, {});
    }
};

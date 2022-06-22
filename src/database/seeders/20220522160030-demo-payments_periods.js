"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("payments_periods", [{
            name: "Quincenal",
        },
        {
            name: "Mensual",
        }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payments_periods", null, {});
    }
};

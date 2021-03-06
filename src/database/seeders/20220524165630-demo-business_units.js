"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("business_units", [{
            name: "Michelada",
        },
        {
            name: "Arkus Nexus",
        },
        {
            name: "Springfield"
        }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("business_units", null, {});
    }
};

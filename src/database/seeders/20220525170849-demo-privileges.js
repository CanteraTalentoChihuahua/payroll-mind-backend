"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("privileges", [{
            id: 1,
            description: "Editar",
        }]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("business_units", null, {});
    }
};

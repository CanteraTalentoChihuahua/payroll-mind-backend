"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("privileges", [{
            description: "Crear administradores",
        },
        {
            description: "Crear unidades de negocio",
        }]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("privileges", null, {});
    }
};

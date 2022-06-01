"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("privileges", [{
            description: "Crear administradores",
        },{
            description: "Crear unidades de negocio",
        },{
            description: "Crear usuarios"
        },{
            description: "Editar usuarios"
        },{
            description: "Borrar usuarios"
        },{
            description: "Generar recibos de nómina"
        },{
            description: "Editar datos de nómina"
        }
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("privileges", null, {});
    }
};

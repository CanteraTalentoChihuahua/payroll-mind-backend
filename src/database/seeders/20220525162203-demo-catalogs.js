"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("catalogs", [{
            name: "Edición",
            description: "Puede editar",
            privileges: {privileges: [1, 2, 3, 4, 5, 6, 7, 9, 10]} , 
        },{
            name: "Control de usuarios",
            description: "Puede crear, editar y borrar usuarios",
            privileges: {privileges: [3, 4, 5]}
        },{
            name: "Control de nómina",
            description: "Puede generar recibos y editar datos",
            privileges: {privileges: [6, 7]}
        }],{}, {privileges:{type: new Sequelize.JSON()}});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("catalogs", null, {});
    }
};

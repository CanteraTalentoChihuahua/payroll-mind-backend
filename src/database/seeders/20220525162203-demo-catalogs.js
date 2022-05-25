"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("catalogs", [{
            id: 1,
            name: "Edición",
            description: "Puede editar",
            privileges: {privileges:[123,456]} , 
        }],{}, {privileges:{type:new Sequelize.JSON()}});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("catalogs", null, {});
    }
};

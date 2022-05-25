"use strict";

const sequelize = require("sequelize");

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("catalogs", [{
            id: 1,
            name: "Editar",
            description: "Puede editar todo",
            privileges: {privileges: [123,456]}
        }], {}, {privileges: {type:new sequelize.JSON()}});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("catalogs", null, {});
    }
};

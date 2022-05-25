"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("privileges", [{
            id: 1,
            description: "Edición",
        }],);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("catalogs", null, {});
    }
};

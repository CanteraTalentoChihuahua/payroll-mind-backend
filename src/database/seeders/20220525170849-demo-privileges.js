"use strict";
const privileges = require("../../util/objects").Privileges;

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("privileges", Object.values(privileges));
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("privileges", null, {});
    }
};

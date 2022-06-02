"use strict";
const privileges = require("../../util/enums").Privileges;

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("privileges", Object.values(privileges).map((privilege) => { return { description: privilege }; }));
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("privileges", null, {});
    }
};

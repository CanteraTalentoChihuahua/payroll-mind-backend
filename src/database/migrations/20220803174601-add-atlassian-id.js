"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "atlassianId", {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        });
    },

    async down (queryInterface, _) {
        await queryInterface.removeColumn("users", "atlassianId");
    }
};

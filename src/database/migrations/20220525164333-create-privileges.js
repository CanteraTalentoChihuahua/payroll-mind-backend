"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("privileges", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("privileges");
    }
};

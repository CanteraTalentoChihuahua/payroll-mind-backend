"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("JiraConnections", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            url: {
                type: Sequelize.STRING
            },
            clientKey: {
                type: Sequelize.STRING
            },
            sharedSecret: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("JiraConnections");
    }
};

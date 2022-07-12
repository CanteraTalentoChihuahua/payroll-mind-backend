"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("outcomes_users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            outcome_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            counter: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("outcomes_users");
    }
};

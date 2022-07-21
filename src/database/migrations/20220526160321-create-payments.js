"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payments", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            salary_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            incomes: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            total_incomes: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            outcomes: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            total_outcomes: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            total_amount: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            payment_period_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            payment_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("payments");
    }
};

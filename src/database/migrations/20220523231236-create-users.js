"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            second_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            second_last_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false
            },
            privileges: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            payment_period_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            business_unit: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            on_leave: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            salary: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date()
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        }, {});
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("users");
    }
};
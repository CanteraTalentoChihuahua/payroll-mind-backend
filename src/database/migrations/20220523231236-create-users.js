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
            birthday: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            role_id: {
                type: Sequelize.INTEGER,
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
            salary_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            bank: {
                type: Sequelize.STRING,
                allowNull: false
            },
            CLABE: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false
            },
            payroll_schema_id: {
                type: Sequelize.INTEGER,
                allowNull: false
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

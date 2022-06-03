"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payrolls", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            payment_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            payment_period_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            business_unit_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            total_amount: {
                allowNull: false,
                type: Sequelize.DECIMAL
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("payrolls");
    }
};

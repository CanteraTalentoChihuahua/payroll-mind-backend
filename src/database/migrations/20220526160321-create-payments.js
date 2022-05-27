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

                type: Sequelize.INTEGER,
                allowNull: false

            },

            total_amount: {

                type: Sequelize.DECIMAL,
                allowNull: false

            },

            automated_bonuses: {

                type: Sequelize.JSONB,
                allowNull: false

            },

            manual_bonuses: {

                type: Sequelize.JSONB,
                allowNull: false

            },

            substracted_amount: {

                type: Sequelize.DECIMAL,
                allowNull: false

            },

            payment_period_id: {

                type: Sequelize.INTEGER,
                allowNull: false

            },

            payment_date_id: {

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

        });

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.dropTable("payments");

    }

};

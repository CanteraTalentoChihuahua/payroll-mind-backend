"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable("catalogs", {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER

            },
            name: {

                type: Sequelize.STRING,
                allowNull: false
            },

            description: {

                type: Sequelize.STRING,
                allowNull: false
            },

            privileges: {

                type: Sequelize.JSONB,
                allowNull: false
            }
        });

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.dropTable("catalogs");

    }

};

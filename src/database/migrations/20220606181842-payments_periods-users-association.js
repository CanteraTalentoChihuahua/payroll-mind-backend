"use strict";

const users = require("../models/users");

module.exports = {
    async up (queryInterface, Sequelize) {
        queryInterface.addConstraint(users, {
            fields: ["payment_period_id"],
            type:"foreign key",
            name: "users_paymentsPeriods_association",
            references: {
                model: "payments_periods",
                key: "id"
                
            }
        });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeConstraint(users,"users_paymentsPeriods_association");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    }
};

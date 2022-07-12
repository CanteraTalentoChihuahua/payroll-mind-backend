"use strict";

const TABLE_NAME = "income_users";
const INCOME_CONSTRAINT_NAME = "income_fk";
const USER_CONSTRAINT_NAME = "user_fk";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addConstraint(TABLE_NAME, {
            fields: ["income_id"],
            name: INCOME_CONSTRAINT_NAME,
            type: "foreign key",
            references: {
                table: "Incomes",
                field: "id"
            }
        });
        await queryInterface.addConstraint(TABLE_NAME, {
            fields: ["user_id"],
            name: USER_CONSTRAINT_NAME,
            type: "foreign key",
            references: {
                table: "users",
                field: "id"
            }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeConstraint(TABLE_NAME, INCOME_CONSTRAINT_NAME);
        await queryInterface.removeConstraint(TABLE_NAME, USER_CONSTRAINT_NAME);
    }
};

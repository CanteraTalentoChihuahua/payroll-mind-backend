'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("incomes_users", {
      fields: ["income_id"],
      name: "incomes_users_association",
      type: "foreign key",
      references: {
        table: "incomes",
        field: "id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("incomes_users", "incomes_users_association");
  }
};

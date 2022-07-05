'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users", {
      fields: ["salary_id"],
      name: "users_salaries_association",
      type: "foreign key",
      references: {
        table: "salaries",
        field: "id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("users", "users_salaries_association");
  }
};

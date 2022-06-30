'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("outcomes_users", {
      fields: ["outcome_id"],
      name: "outcomes_users_association",
      type: "foreign key",
      references: {
        table: "outcomes",
        field: "id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("outcomes_users", "outcomes_users_association");
  }
};

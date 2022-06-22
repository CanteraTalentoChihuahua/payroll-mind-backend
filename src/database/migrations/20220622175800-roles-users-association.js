'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("users", {
      fields: ["role_id"],
      name: "users_roles_association",
      type: "foreign key",
      references: {
          table: "roles",
          field: "id"
      }
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("users", "users_roles_association");
  }
};

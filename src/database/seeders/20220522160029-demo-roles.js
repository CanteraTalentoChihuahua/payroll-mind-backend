'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      {
        name: "superadmin",
      },
      {
        name: "admin",
      },
      {
        name: "collab",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", null, {});
  }
};

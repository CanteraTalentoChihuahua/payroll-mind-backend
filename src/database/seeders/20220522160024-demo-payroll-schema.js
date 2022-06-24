'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert("payroll_schemas", [
        {
          name: "Mixto"
        },
        {
          name: "Asimilado"
        }
      ]);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete("payroll_schemas", null, {});
  }
};

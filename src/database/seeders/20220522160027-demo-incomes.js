'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("incomes", [
      {
        name: "Bono de Desempeño",
        automatic: false,
        active: true
      },
      {
        name: "Aguinaldo",
        automatic: true,
        active: true
      },
      {
        name: "Bonificación Sample 1",
        automatic: false,
        active: false
      },
      {
        name: "Bonificación Sample 2",
        automatic: true,
        active: true
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("incomes", null, {});
  }
};

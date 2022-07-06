'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("outcomes", [
      {
        name: "Fondo de ahorro",
        automatic: true,
        active: true
      },
      {
        name: "Seguro de gastos medicos",
        automatic: true,
        active: true
      },
      {
        name: "Impuesto Sample 1",
        automatic: false,
        active: false
      },
      {
        name: "Impuesto Sample 2",
        automatic: false,
        active: true
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outcomes", null, {});
  }
};

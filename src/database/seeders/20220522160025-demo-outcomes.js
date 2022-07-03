'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("outcomes", [
      {
        name: "Fondo de reconstrucción facial",
        automatic: false,
        active: true
      },
      {
        name: "Dotación de Ricolino",
        automatic: true,
        active: true
      },
      {
        name: "Fondo Aurrera La Campeona de los Precios Bajos",
        automatic: false,
        active: false
      },
      {
        name: "Fondo de Bikini",
        automatic: false,
        active: true
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outcomes", null, {});
  }
};

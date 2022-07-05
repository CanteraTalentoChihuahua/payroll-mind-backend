'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("incomes", [
      {
        name: "Bono Pride",
        automatic: false,
        active: true
      },
      {
        name: "Bono de U2",
        automatic: true,
        active: true
      },
      {
        name: "Bonomio",
        automatic: false,
        active: false
      },
      {
        name: "Bono Lizard Wizard",
        automatic: true,
        active: true
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("incomes", null, {});
  }
};

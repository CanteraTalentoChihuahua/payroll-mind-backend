'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("incomes-users", [
      {
        user_id: 2,
        income_id: 1,
        counter: 2,
        amount: 2500.99
      },
      {
        user_id: 2,
        income_id: 2,
        counter: 1,
        amount: 1600.99
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("incomes-users", null, {});
  }
};

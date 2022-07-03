'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("incomes_users", [
      {
        user_id: 2,
        income_id: 1,
        counter: 2,
        amount: 6900
      },
      {
        user_id: 2,
        income_id: 2,
        counter: 1,
        amount: 1500
      },
      {
        user_id: 2,
        income_id: 3,
        counter: 2,
        amount: 2500.5
      },
      {
        user_id: 3,
        income_id: 1,
        counter: 1,
        amount: 9600
      },
      {
        user_id: 3,
        income_id: 2,
        counter: 4,
        amount: 1500
      },
      {
        user_id: 3,
        income_id: 3,
        counter: 1,
        amount: 6000
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("incomes_users", null, {});
  }
};

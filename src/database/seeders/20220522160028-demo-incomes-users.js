/* eslint-disable indent */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("incomes_users", [
      // User: 2 - current - 08/15/2022
      {
        user_id: 2,
        income_id: 1,
        counter: 1,
        amount: 2300
      },
      {
        user_id: 2,
        income_id: 2,
        counter: 1,
        amount: 7000
      },
      {
        user_id: 2,
        income_id: 4,
        counter: 2,
        amount: 500
      },

      // User: 2 - past - 07/15/2022
      {
        user_id: 2,
        income_id: 1,
        counter: 1,
        amount: 2300
      },
      {
        user_id: 2,
        income_id: 2,
        counter: 1,
        amount: 7000
      },
      {
        user_id: 2,
        income_id: 4,
        counter: 2,
        amount: 500
      },

      // User: 2 - past - 06/15/2022
      {
        user_id: 2,
        income_id: 1,
        counter: 1,
        amount: 2300
      },
      {
        user_id: 2,
        income_id: 2,
        counter: 1,
        amount: 7000
      },
      {
        user_id: 2,
        income_id: 4,
        counter: 2,
        amount: 500
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


      {
        user_id: 4,
        income_id: 2,
        counter: 1,
        amount: 9600
      },
      {
        user_id: 4,
        income_id: 3,
        counter: 1,
        amount: 1500
      },
      {
        user_id: 4,
        income_id: 4,
        counter: 1,
        amount: 2300
      },


      {
        user_id: 5,
        income_id: 1,
        counter: 1,
        amount: 6000
      },
      {
        user_id: 5,
        income_id: 2,
        counter: 4,
        amount: 200
      },
      {
        user_id: 5,
        income_id: 3,
        counter: 1,
        amount: 600
      },

      {
        user_id: 6,
        income_id: 1,
        counter: 1,
        amount: 9600
      },
      {
        user_id: 6,
        income_id: 2,
        counter: 2,
        amount: 1500
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("incomes_users", null, {});
  }
};

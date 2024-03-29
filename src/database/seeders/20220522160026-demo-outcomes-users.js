'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("outcomes_users", [
      // User: 2 - current - 08/15/2022
      {
        user_id: 2,
        outcome_id: 1,
        counter: 1,
        amount: 2000
      },
      {
        user_id: 2,
        outcome_id: 2,
        counter: 1,
        amount: 3500
      },
      {
        user_id: 2,
        outcome_id: 3,
        counter: 1,
        amount: 250
      },
      {
        user_id: 2,
        outcome_id: 4,
        counter: 1,
        amount: 1000
      },

      // User: 2 - current - 07/15/2022
      {
        user_id: 2,
        outcome_id: 1,
        counter: 1,
        amount: 2000
      },
      {
        user_id: 2,
        outcome_id: 2,
        counter: 1,
        amount: 4000
      },
      {
        user_id: 2,
        outcome_id: 3,
        counter: 1,
        amount: 5000
      },
      {
        user_id: 2,
        outcome_id: 4,
        counter: 1,
        amount: 1500
      },


      // User: 2 - current - 06/15/2022
      {
        user_id: 2,
        outcome_id: 1,
        counter: 1,
        amount: 1200
      },
      {
        user_id: 2,
        outcome_id: 2,
        counter: 1,
        amount: 500
      },
      {
        user_id: 2,
        outcome_id: 3,
        counter: 1,
        amount: 750
      },
      {
        user_id: 2,
        outcome_id: 4,
        counter: 1,
        amount: 900
      },


      {
        user_id: 3,
        outcome_id: 2,
        counter: 1,
        amount: 5000
      },
      {
        user_id: 3,
        outcome_id: 3,
        counter: 2,
        amount: 1500
      },
      {
        user_id: 3,
        outcome_id: 4,
        counter: 1,
        amount: 1000
      },


      {
        user_id: 4,
        outcome_id: 1,
        counter: 2,
        amount: 1000
      },
      {
        user_id: 4,
        outcome_id: 2,
        counter: 2,
        amount: 500
      },
      {
        user_id: 4,
        outcome_id: 4,
        counter: 1,
        amount: 5000
      },


      {
        user_id: 5,
        outcome_id: 3,
        counter: 4,
        amount: 500
      },
      {
        user_id: 5,
        outcome_id: 4,
        counter: 2,
        amount: 1500
      },

      {
        user_id: 6,
        outcome_id: 2,
        counter: 4,
        amount: 500
      },
      {
        user_id: 6,
        outcome_id: 4,
        counter: 1,
        amount: 4500
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outcomes_users", null, {});
  }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("outcomes_users", [
      {
        user_id: 2,
        outcome_id: 1,
        counter: 1,
        amount: 17500
      },
      {
        user_id: 2,
        outcome_id: 3,
        counter: 4,
        amount: 2000
      },
      {
        user_id: 3,
        outcome_id: 4,
        counter: 2,
        amount: 4000
      },
      {
        user_id: 3,
        outcome_id: 1,
        counter: 2,
        amount: 5000
      },
      {
        user_id: 3,
        outcome_id: 2,
        counter: 5,
        amount: 6000
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outcomes_users", null, {});
  }
};

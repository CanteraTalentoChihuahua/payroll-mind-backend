'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("outcomes_users", [
      {
        user_id: 2,
        outcome_id: 1,
        counter: 2,
        amount: 420.42
      },
      {
        user_id: 2,
        outcome_id: 3,
        counter: 1,
        amount: 69.69
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outcomes_users", null, {});
  }
};

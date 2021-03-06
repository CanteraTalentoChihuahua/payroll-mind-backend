'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("salaries", [
      {
        user_id: 1,
        salary: 200000,
        date: new Date()
      },
      {
        user_id: 2,
        salary: 50000,
        date: new Date(),
      },
      {
        user_id: 3,
        salary: 40000,
        date: new Date()
      },
      {
        user_id: 4,
        salary: 15000,
        date: new Date()
      },
      {
        user_id: 5,
        salary: 15000,
        date: new Date()
      },
      {
        user_id: 6,
        salary: 15000,
        date: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("salaries", null, {});
  }
};

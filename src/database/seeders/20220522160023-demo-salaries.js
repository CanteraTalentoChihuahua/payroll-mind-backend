'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("salaries", [
      {
        user_id: 2,
        salary: 2000000,
        date: new Date()
      },
      {
        user_id: 3,
        salary: 15,
        date: new Date(),
      },
      {
        user_id: 1,
        salary: 6969,
        date: new Date()
      }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("salaries", null, {});
  }
};

"use strict";


// I don't think it should reference other columns
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("pre_payments", [{
      user_id: 2,
      salary_id: 2,
      incomes: { incomes: [1, 2, 3, 4] },
      total_incomes: 2500,
      outcomes: { outcomes: [1, 2, 3, 4] },
      total_outcomes: 3000,
      total_amount: 45000,
      payment_period_id: 1,
      payment_date: new Date(),
      },
      {
        user_id: 3,
        salary_id: 3,
        incomes: { incomes: [4, 5, 6] },
        total_incomes: 2500,
        outcomes: { outcomes: [5, 6, 7] },
        total_outcomes: 3000,
        total_amount: 45000,
        payment_period_id: 1,
        payment_date: new Date(),
      }
  ], {}, {
      incomes: { type: new Sequelize.JSON() },
      outcomes: { type: new Sequelize.JSON() }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("pre_payments", null, {});
  }
};

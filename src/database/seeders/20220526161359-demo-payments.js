
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("payments", [{
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [1, 2, 3, 4] },
            total_incomes: 2500,
            outcomes: { outcomes: [1, 2, 3, 4] },
            total_outcomes: 3000,
            total_amount: 45000,
            payment_period_id: 1,
            payment_date: new Date(2022, 1, 15),
        },
        {
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [1, 2, 3, 4] },
            total_incomes: 2000,
            outcomes: { outcomes: [1, 2, 3, 4] },
            total_outcomes: 3000,
            total_amount: 44500,
            payment_period_id: 1,
            payment_date: new Date(2022, 2, 15),
        },
        {
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [1, 2, 3, 4] },
            total_incomes: 1500,
            outcomes: { outcomes: [1, 2, 3, 4] },
            total_outcomes: 3000,
            total_amount: 44000,
            payment_period_id: 1,
            payment_date: new Date(2022, 3, 15),
        },
        {
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [1, 2, 3, 4] },
            total_incomes: 1000,
            outcomes: { outcomes: [1, 2, 3, 4] },
            total_outcomes: 3000,
            total_amount: 43500,
            payment_period_id: 1,
            payment_date: new Date(2022, 4, 15),
        }], {}, {
            incomes: { type: new Sequelize.JSON() },
            outcomes: { type: new Sequelize.JSON() }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payments", null, {});
    }
};


module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("payments", [{
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [7, 8, 9] },
            total_incomes: 2500,
            outcomes: { outcomes: [9, 10, 11, 12] },
            total_outcomes: 3000,
            total_amount: 45000,
            payment_period_id: 2,
            payment_date: String(new Date("06/15/2022").toUTCString())
        },
        {
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [4, 5, 6] },
            total_incomes: 2000,
            outcomes: { outcomes: [5, 6, 7, 8] },
            total_outcomes: 3000,
            total_amount: 44500,
            payment_period_id: 2,
            payment_date: String(new Date("07/15/2022").toUTCString())
        },
        {
            user_id: 2,
            salary_id: 2,
            incomes: { incomes: [1, 2, 3] },
            total_incomes: 1500,
            outcomes: { outcomes: [1, 2, 3, 4] },
            total_outcomes: 3000,
            total_amount: 44000,
            payment_period_id: 2,
            payment_date: String(new Date("08/15/2022").toUTCString())
        }], {}, {
            incomes: { type: new Sequelize.JSON() },
            outcomes: { type: new Sequelize.JSON() }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payments", null, {});
    }
};

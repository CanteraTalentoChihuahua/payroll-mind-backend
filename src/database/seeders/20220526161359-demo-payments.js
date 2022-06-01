"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("payments", [{
            user_id: 2,
            total_amount:1022.36,
            automated_bonuses: {automated_bonuses:[456,123]},
            manual_bonuses: {manual_bonuses:[456,123]},
            substracted_amount:1022.36,
            payment_period_id:3,
            payment_date_id:4,
        }],{}, {automated_bonuses:{type:new Sequelize.JSON()},
        manual_bonuses:{type:new Sequelize.JSON()}
    });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payments", null, {});
    }
};
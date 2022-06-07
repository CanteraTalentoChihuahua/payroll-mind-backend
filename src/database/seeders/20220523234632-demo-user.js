"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("users", [{
            first_name: "John",
            second_name: "Wayne",
            last_name: "Doe",
            second_last_name: "Moe",
            email: "johnwayne@gmail.com",
            password: "secret_password",
            role: "superadmin",
            privileges: {
                privileges: [1, 2, 3, 4, 5, 9, 8, 10]
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [1, 2]
            },
            on_leave: false,
            active: true,
            salary: 20000.12,
            token: null,
            // Currently, bulk inserting JSON is bugged and this is a workaround
            // https://github.com/sequelize/sequelize/issues/8310
        },
        {
            first_name: "Abraham",
            second_name: null,
            last_name: "Gonzalez",
            second_last_name: "Macias",
            email: "abrahamgmacias@gmail.com",
            password: "secret_password",
            role: "admin",
            privileges: {
                privileges: [1]
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [3, 4, 5, 6, 7, 8]
            },
            on_leave: false,
            active: true,
            salary: 0,
            token: null,
        },
        {
            first_name: "Elvis",
            second_name: null,
            last_name: "Tek",
            second_last_name: "Tonik",
            email: "elvistek@gmail.com",
            password: "secret_password",
            role: "collab",
            privileges: {
                privileges: []
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [1]
            },
            on_leave: false,
            active: true,
            salary: 20,
            token: null,
        }],
            { timestamps: true },
            {
                privileges: { type: new Sequelize.JSON() },
                business_unit: { type: new Sequelize.JSON() }
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    }
};
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("users", [{
            first_name: "John",
            second_name: "Wayne",
            last_name: "Doe",
            second_last_name: "Moe",
            birthday: new Date(),
            email: "johnwayne@gmail.com",
            password: "secret_password",
            phone_number: "6622274321",
            role_id: 1,
            privileges: {
                privileges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [1, 2]
            },
            on_leave: false,
            active: true,
            salary_id: 2,
            bank: "Banco Gidon",
            CLABE: "2132123131132123",
            payroll_schema_id: 1
            // Currently, bulk inserting JSON is bugged and this is a workaround
            // https://github.com/sequelize/sequelize/issues/8310
        },
        {
            first_name: "Abraham",
            second_name: null,
            last_name: "Gonzalez",
            second_last_name: "Macias",
            birthday: new Date(),
            email: "abrahamgmacias@gmail.com",
            password: "secret_password",
            phone_number: "66222743282",
            role_id: 2,
            privileges: {
                privileges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [1]
            },
            on_leave: false,
            active: true,
            bank: "Banco Branza",
            CLABE: "2132115615165153",
            salary_id: 4,
            payroll_schema_id: 2
        },
        {
            first_name: "Another",
            second_name: null,
            last_name: "User",
            second_last_name: "Tonik",
            birthday: new Date(),
            email: "anotheruser@gmail.com",
            password: "secret_password",
            phone_number: "6622274323",
            role_id: 3,
            privileges: {
                privileges: []
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [1]
            },
            on_leave: false,
            active: true,
            salary_id: 3,
            bank: "Banco Media",
            CLABE: "165156465561514561",
            payroll_schema_id: 1
        },
        {
            first_name: "Elvis",
            second_name: null,
            last_name: "Tek",
            second_last_name: "Tonik",
            birthday: new Date(),
            email: "elvistek@gmail.com",
            password: "secret_password",
            phone_number: "6622274328",
            role_id: 3,
            privileges: {
                privileges: []
            },
            payment_period_id: 1,
            business_unit: {
                business_unit_ids: [1]
            },
            on_leave: false,
            active: true,
            salary_id: 1,
            bank: "Banco Dicia",
            CLABE: "4564156465456545",
            payroll_schema_id: 2
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

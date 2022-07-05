"use strict";

// Currently, bulk inserting JSON is bugged and this is a workaround
// https://github.com/sequelize/sequelize/issues/8310

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("users", [
            {
                first_name: "John",
                second_name: "Doe",
                last_name: "Wayne",
                second_last_name: "Moe",
                birthday: new Date(1995, 1, 24),
                email: "johnwayne@arkus.com",
                password: "secret_password",
                phone_number: "6142274321",
                role_id: 1,
                privileges: {
                    privileges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
                },
                payment_period_id: 1,
                business_unit: {
                    business_unit_ids: [1, 2, 3]
                },
                on_leave: false,
                active: true,
                bank: "Banco Branza",
                CLABE: "18793513256",
                salary_id: 1,
                payroll_schema_id: 1
            },
            {
                first_name: "Abraham",
                second_name: null,
                last_name: "Gonzalez",
                second_last_name: "Macias",
                birthday: new Date(1999, 7, 11),
                email: "abrahamgmacias@arkus.com",
                password: "secret_password",
                phone_number: "6622274328",
                role_id: 2,
                privileges: {
                    privileges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
                },
                payment_period_id: 1,
                business_unit: {
                    business_unit_ids: [1, 2],
                },
                on_leave: false,
                active: true,
                bank: "Banco Branza",
                CLABE: "99177894215",
                salary_id: 2,
                payroll_schema_id: 2
            },
            {
                first_name: "Juan",
                second_name: "Pedro",
                last_name: "Montes de Oca",
                second_last_name: "del Villar",
                birthday: new Date(1997, 5, 17),
                email: "elmontes@arkus.com",
                password: "secret_password",
                phone_number: "6622275173",
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
                bank: "Banco Media",
                CLABE: "68713898895",
                salary_id: 3,
                payroll_schema_id: 1
            },
            {
                first_name: "Anuel",
                second_name: null,
                last_name: "Perez",
                second_last_name: "Ramirez",
                birthday: new Date(2001, 2, 27),
                email: "jperezrojas@arkus.com",
                password: "secret_password",
                phone_number: "6142274123",
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
                bank: "Banco Dicia",
                CLABE: "16516513215",
                salary_id: 4,
                payroll_schema_id: 2
            },
            {
                first_name: "Adriana",
                second_name: null,
                last_name: "Flores",
                second_last_name: "Rojas",
                birthday: new Date(2001, 2, 27),
                email: "adreanar@arkus.com",
                password: "secret_password",
                phone_number: "6142456729",
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
                bank: "Banco Dicia",
                CLABE: "16516513352",
                salary_id: 5,
                payroll_schema_id: 2
            },
            {
                first_name: "Epigmenio",
                second_name: null,
                last_name: "Cruz",
                second_last_name: "Güero",
                birthday: new Date(1980, 7, 8),
                email: "epigmeniocruz@arkus.com",
                password: "secret_password",
                phone_number: "61471774935",
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
                bank: "Banco Dicia",
                CLABE: "16547853215",
                salary_id: 6,
                payroll_schema_id: 2
            }
        ],
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

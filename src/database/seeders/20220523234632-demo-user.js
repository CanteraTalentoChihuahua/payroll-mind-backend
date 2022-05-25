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
            role: "employee",
            privileges: {
                privileges: [123, 456]
            },
            payment_period_id: 1,
            business_unit_string: "Michelada",
            on_leave: false,
            active: true,
            salary: 20000.12
        }], {}, {privileges:{type:new Sequelize.JSON()}});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    }
};

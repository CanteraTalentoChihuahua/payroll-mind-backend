"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
            //users.belongsTo(models.payments, { foreignKey: "user_id" });
            users.belongsTo(models.roles, { foreignKey: "role_id" });
            users.belongsTo(models.payroll_schemas, { foreignKey: "payroll_schema_id" });
            users.belongsTo(models.salaries, { foreignKey: "salary_id" });
            users.belongsTo(models.payments_periods, { foreignKey: "payment_period_id" }); 
        }
    }

    users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: DataTypes.STRING,
        second_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        second_last_name: DataTypes.STRING,
        birthday: DataTypes.STRING,
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        role_id: DataTypes.STRING,
        payment_period_id: DataTypes.INTEGER,
        salary_id: DataTypes.INTEGER,
        business_unit: DataTypes.JSONB,
        bank: DataTypes.STRING,
        CLABE: DataTypes.STRING,
        payroll_schema_id: DataTypes.INTEGER,
        password: DataTypes.STRING,
        privileges: DataTypes.JSONB,
        on_leave: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN,
        atlassianId: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: "users",
        timestamps: false
    });
    return users;
};

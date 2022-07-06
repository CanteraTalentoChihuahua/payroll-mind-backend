"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class incomes_users extends Model {
        static associate(models) {
            incomes_users.belongsTo(models.incomes, { foreignKey: "income_id", allowNull: false });
        }
    }
    incomes_users.init({
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        income_id: DataTypes.INTEGER,
        counter: DataTypes.INTEGER,
        amount: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: "incomes_users",
        paranoid: true
    });
    return incomes_users;
};

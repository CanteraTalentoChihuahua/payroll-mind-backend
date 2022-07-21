"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            payments.belongsTo(models.salaries, { foreignKey: "salary_id" });
            payments.belongsTo(models.payments_periods, { foreignKey: "payment_period_id" });
        }

    }
    payments.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: DataTypes.INTEGER,
        incomes: DataTypes.JSONB,
        total_incomes: DataTypes.DECIMAL,
        outcomes: DataTypes.JSONB,
        total_outcomes: DataTypes.DECIMAL,
        total_amount: DataTypes.DECIMAL,
        payment_period_id: DataTypes.INTEGER,
        payment_date: DataTypes.DATE
    }, {
        sequelize,
        modelName: "payments",
        paranoid: true
    });
    return payments;
};

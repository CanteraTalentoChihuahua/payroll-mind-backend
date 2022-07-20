'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pre_payments extends Model {

    static associate(models) {
      // pre_payments.belongsTo(models.users, { foreignKey: "user_id" });
      // pre_payments.belongsTo(models.payroll_schemas, { foreignKey: "payroll_schema_id" });
      pre_payments.belongsTo(models.salaries, { foreignKey: "salary_id" });
      pre_payments.belongsTo(models.payments_periods, { foreignKey: "payment_period_id" });
    }
  }
  pre_payments.init({
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
    modelName: 'pre_payments',
    paranoid: true
  });
  return pre_payments;
};
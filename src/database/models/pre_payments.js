'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class pre_payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  });
  return pre_payments;
};
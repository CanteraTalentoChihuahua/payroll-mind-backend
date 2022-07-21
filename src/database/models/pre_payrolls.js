'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pre_payroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pre_payroll.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payment_date: DataTypes.DATE,
    payment_period_id: DataTypes.INTEGER,
    business_unit_id: DataTypes.INTEGER,
    total_amount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'pre_payroll',
    paranoid: true
  });
  return pre_payroll;
};
'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class incomes_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  incomes_users.init({
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    income_id: Sequelize.INTEGER,
    counter: Sequelize.INTEGER,
    amount: Sequelize.DECIMAL
  }, {
    sequelize,
    modelName: 'incomes-users',
    paranoid: true
  });
  return incomes_users;
};
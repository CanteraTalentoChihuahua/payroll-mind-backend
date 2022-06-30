'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class incomes_users extends Model {
    static associate(models) {
      incomes_users.belongsTo(models.incomes, { foreignKey: "income_id", allowNull: false });
      models.incomes.hasMany(incomes_users);
    }
  }
  incomes_users.init({
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    income_id: Sequelize.INTEGER,
    counter: Sequelize.INTEGER,
    amount: Sequelize.DECIMAL
  }, {
    sequelize,
    modelName: 'incomes_users',
    paranoid: true
  });
  return incomes_users;
};
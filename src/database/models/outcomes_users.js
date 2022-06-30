'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class outcomes_users extends Model {
    static associate(models) {
      outcomes_users.belongsTo(models.outcomes, { foreignKey: "outcome_id", allowNull: false });
      models.outcomes.hasMany(outcomes_users);
    }
  }
  outcomes_users.init({
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    income_id: Sequelize.INTEGER,
    counter: Sequelize.INTEGER,
    amount: Sequelize.DECIMAL
  }, {
    sequelize,
    modelName: 'outcomes_users',
    paranoid: true
  });
  return outcomes_users;
};
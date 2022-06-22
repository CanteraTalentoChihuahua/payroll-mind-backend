'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class incomes - users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  incomes - users.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'incomes-users',
    paranoid: true
  });
  return incomes - users;
};
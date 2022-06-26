'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class salaries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  salaries.init({
    name: Sequelize.STRING,
    user_id: Sequelize.INTEGER,
    salary: Sequelize.DECIMAL,
    date: Sequelize.DATE
  }, {
    sequelize,
    modelName: 'salaries',
  });
  return salaries;
};
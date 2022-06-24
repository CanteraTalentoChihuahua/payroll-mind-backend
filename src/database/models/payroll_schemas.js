'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payroll_schemas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payroll_schemas.init({
    name: Sequelize.STRING
  }, {
    sequelize,
    modelName: 'payroll_schemas',
    paranoid: true
  });
  return payroll_schemas;
};
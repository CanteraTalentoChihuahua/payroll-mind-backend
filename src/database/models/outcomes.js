'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class outcomes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  outcomes.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
    automatic: Sequelize.BOOLEAN,
    active: Sequelize.BOOLEAN
  }, {
    sequelize,
    modelName: 'outcomes',
    paranoid: true
  });
  return outcomes;
};
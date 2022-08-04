'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class indicators extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  indicators.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    new_users: DataTypes.JSONB,
    inactive_users: DataTypes.JSONB,
    month: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'indicators',
    paranoid: true
  });
  return indicators;
};
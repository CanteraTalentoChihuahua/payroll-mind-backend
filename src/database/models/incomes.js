"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class incomes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            incomes.hasMany(models.incomes_users);
        }
    }
    incomes.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        automatic: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: "incomes",
        paranoid: true
    });
    return incomes;
};

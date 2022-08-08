"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class salaries extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            salaries.hasOne(models.users, { foreignKey: "salary_id" });
        }
    }
    salaries.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: DataTypes.INTEGER,
        salary: DataTypes.DECIMAL,
        date: DataTypes.DATE
    }, {
        sequelize,
        modelName: "salaries",
        paranoid: true
    });
    return salaries;
};

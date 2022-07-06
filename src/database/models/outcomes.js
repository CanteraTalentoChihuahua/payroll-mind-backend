"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class outcomes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            outcomes.hasMany(models.outcomes_users);
        }
    }
    outcomes.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        automatic: DataTypes.BOOLEAN,
        active: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: "outcomes",
        paranoid: true
    });
    return outcomes;
};

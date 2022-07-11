"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class outcomes_users extends Model {
        static associate(models) {
            outcomes_users.belongsTo(models.outcomes, { foreignKey: "outcome_id", allowNull: false });
        }
    }
    outcomes_users.init({
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        outcome_id: DataTypes.INTEGER,
        counter: DataTypes.INTEGER,
        amount: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: "outcomes_users",
        paranoid: true
    });
    return outcomes_users;
};

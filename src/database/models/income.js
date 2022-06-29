"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize) => {
    class Income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    Income.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        automatic: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "Income",
        paranoid: true
    });
    return Income;
};

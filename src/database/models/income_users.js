"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class income_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    income_users.init({
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        income_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        counter: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.DECIMAL,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "income_users",
        timestamps: false
    });
    return income_users;
};

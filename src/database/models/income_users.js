"use strict";
const {
    Model
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
            type: DataTypes.INTEGER,
            allowNull: false
        },
        income_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        counter: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "income_users",
        timestamps: false
    });
    return income_users;
};

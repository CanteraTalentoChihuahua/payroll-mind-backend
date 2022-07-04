"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class outcomes_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    outcomes_users.init({
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        outcome_id: {
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
        modelName: "outcomes_users",
        timestamps: false
    });
    return outcomes_users;
};

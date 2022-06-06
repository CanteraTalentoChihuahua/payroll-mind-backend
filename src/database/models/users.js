"use strict";
const payments_periods = require ("./payments_periods");
const business_units = require ("./business_units");

const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize) => {
    class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(users) {
            users.belongsTo(business_units, {foreignKey: "business_unit_id", allowNull: false});
            users.belongsTo(payments_periods, {foreignKey: "payment_period_id", allowNull: false});
        }
        
    }
    users.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: Sequelize.STRING,
        password: Sequelize.STRING,
        email: Sequelize.STRING,
        token: Sequelize.STRING
    }, {
        sequelize,
        modelName: "user",
        timestamps: false
    });
    return users;
};

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
        static associate(models) {
            users.belongsTo(models.payments_periods, {foreignKey: "payment_period_id", allowNull: false});
            models.payments_periods.hasOne(users);
        }
    }
    
    users.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: Sequelize.STRING,
        second_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        second_last_name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        role: Sequelize.STRING,
        token: Sequelize.STRING,
        privileges: Sequelize.JSONB,
        payment_period_id: Sequelize.INTEGER,
        business_unit: Sequelize.JSONB,
        on_leave: Sequelize.BOOLEAN,
        active: Sequelize.BOOLEAN,
        salary: Sequelize.DECIMAL
    }, {
        sequelize,
        modelName: "user",
        timestamps: false
    });
    return users;
};


"use strict";
const users = require ("./users");
const payments = require ("./payments");

const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payments_periods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
       
        static associate(models) {
            payments_periods.hasMany(models.payments, {foreignKey:"payment_period_id", allowNull: false});
            models.payments.belongsTo(payments_periods);
        }

    }
    payments_periods.init({
        id: {type:Sequelize.INTEGER,primaryKey:true,autoIncrement: true},
        name: Sequelize.STRING
    }, {
        sequelize,
        modelName: "payments_periods",
    });
    return payments_periods;
};

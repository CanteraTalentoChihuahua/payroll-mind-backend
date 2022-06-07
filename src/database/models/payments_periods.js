"use strict";
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
       
        static associate(payments_periods) {
            payments_periods.hasOne(payments_periods.users);
            payments_periods.hasOne(payments_periods.payments);
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

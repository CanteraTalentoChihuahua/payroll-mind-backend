"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payments_periods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
       
        static associate(models) {
            payments_periods.hasOne(models.payments, { foreignKey: "payment_period_id" });
        }

    }
    payments_periods.init({
        id: {type:DataTypes.INTEGER,primaryKey:true,autoIncrement: true},
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: "payments_periods",
    });
    return payments_periods;
};

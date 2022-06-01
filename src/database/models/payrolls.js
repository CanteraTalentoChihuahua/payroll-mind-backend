"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payrolls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    payrolls.init({
        id: DataTypes.INTEGER,
        payment_date: DataTypes.DATE,
        payment_period_id: DataTypes.INTEGER,
        business_unit_id: DataTypes.INTEGER,
        total_amount: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: "payrolls",
    });
    return payrolls;
};
"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    payments.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        userid: DataTypes.INTEGER,
        total_amount: DataTypes.DECIMAL,
        automated_bonuses: DataTypes.JSONB,
        manual_bonuses: DataTypes.JSONB,
        substracted_amount: DataTypes.DECIMAL,
        payment_period_id: DataTypes.INTEGER,
        payment_date_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: "payments",
    });
    return payments;
};

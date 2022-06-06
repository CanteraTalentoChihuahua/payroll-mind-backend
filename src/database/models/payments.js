"use strict";
const payments_periods = require ("./payments_periods");

const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        
        static associate(payments) {
            payments.belongsTo(payments_periods, {foreignKey:"payment_period_id", allowNull: false});
        }

    }
    payments.init({
        id: {type:Sequelize.INTEGER,primaryKey:true,autoIncrement: true},
        user_id: Sequelize.INTEGER,
        total_amount: Sequelize.DECIMAL,
        automated_bonuses: Sequelize.JSONB,
        manual_bonuses: Sequelize.JSONB,
        substracted_amount: Sequelize.DECIMAL,
        payment_period_id: Sequelize.INTEGER,
        payment_date_id: Sequelize.INTEGER
    }, {
        sequelize,
        modelName: "payments",
    });
    return payments;
};

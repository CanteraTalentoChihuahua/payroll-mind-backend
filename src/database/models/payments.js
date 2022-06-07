"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize) => {
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
        id: Sequelize.INTEGER,
        userid: Sequelize.INTEGER,
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

"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize) => {
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
        id: Sequelize.INTEGER,
        payment_date: Sequelize.DATE,
        payment_period_id: Sequelize.INTEGER,
        business_unit_id: Sequelize.INTEGER,
        total_amount: Sequelize.DECIMAL
    }, {
        sequelize,
        modelName: "payrolls",
    });
    return payrolls;
};

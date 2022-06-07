"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payrolls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

        static associate(payrolls) {
            payrolls.belongsTo(payrolls.business_units, { foreignKey: "business_unit_id" });
        }
        
    }
    payrolls.init({
        id: {type:Sequelize.INTEGER,primaryKey:true,autoIncrement: true},
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

"use strict";
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
        static associate(users) {
            users.belongsTo(users.business_units, { foreignKey: "business_unit_id" });
            users.belongsTo(users.payments_periods, { foreignKey: "payment_period_id" });
        }
        
    }
    users.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: Sequelize.STRING,
        password: Sequelize.STRING
    }, {
        sequelize,
        modelName: "user",
        timestamps: false
    });
    return users;
};

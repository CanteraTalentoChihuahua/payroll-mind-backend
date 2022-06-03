"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize) => {
    class payments_periods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    payments_periods.init({
        id: Sequelize.INTEGER,
        name: Sequelize.STRING
    }, {
        sequelize,
        modelName: "payments_periods",
    });
    return payments_periods;
};

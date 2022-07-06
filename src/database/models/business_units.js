"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class business_units extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            business_units.hasOne(models.users);
            business_units.hasOne(models.payrolls);
        }

    }
    business_units.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING
    }, {
        sequelize,
        paranoid: true,
        modelName: "business_units",
    });
    return business_units;
};

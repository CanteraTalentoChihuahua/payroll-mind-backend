"use strict";
const users = require("./users");
const payrolls = require("./payrolls");

const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class business_units extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

        static associate(business_units) {
            business_units.hasOne(users);
            business_units.hasOne(payrolls);
        }
       
    }
    business_units.init({
        id: {type:Sequelize.INTEGER,primaryKey:true,autoIncrement: true},
        name: Sequelize.STRING
    }, {
        sequelize,
        modelName: "business_units",
    });
    return business_units;
};

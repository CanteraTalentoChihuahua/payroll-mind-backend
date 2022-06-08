"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class privileges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    privileges.init({
        id: {type:Sequelize.INTEGER,primaryKey:true,autoIncrement: true},
        description: Sequelize.STRING
    }, {
        sequelize,
        modelName: "privileges",
    });
    return privileges;
};

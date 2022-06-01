"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class catalogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    catalogs.init({
        id: {type:Sequelize.INTEGER,primaryKey:true,autoIncrement: true},
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        privileges: Sequelize.JSONB
    }, {
        sequelize,
        modelName: "catalogs",
    });
    return catalogs;
};

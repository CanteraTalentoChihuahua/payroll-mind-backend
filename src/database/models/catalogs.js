"use strict";
const {
    Model
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
        id: {type:DataTypes.INTEGER,primaryKey:true,autoIncrement: true},
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        privileges: DataTypes.JSONB
    }, {
        sequelize,
        modelName: "catalogs",
    });
    return catalogs;
};

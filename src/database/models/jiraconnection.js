"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class JiraConnection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    JiraConnection.init({
        url: DataTypes.STRING,
        clientKey: DataTypes.STRING,
        sharedSecret: DataTypes.STRING
    }, {
        sequelize,
        modelName: "JiraConnection",
        indexes: [
            {
                unique: true,
                fields: ["clientKey"]
            }
        ]
    });
    return JiraConnection;
};

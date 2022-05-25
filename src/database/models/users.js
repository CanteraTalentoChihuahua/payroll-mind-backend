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
        static associate(models) {
            // define association here
        }
    }
    users.init({
        id: Sequelize.INTEGER,
        role: Sequelize.STRING
    }, {
        sequelize,
        modelName: "user",
    });
    return users;
};

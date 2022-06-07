"use strict";
const {
    Model, Sequelize
} = require("sequelize");
module.exports = (sequelize) => {
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
        id: Sequelize.INTEGER,
        description: Sequelize.STRING
    }, {
        sequelize,
        modelName: "privileges",
    });
    return privileges;
};

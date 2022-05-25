const sqlz = require("sequelize");
const config = require("../database/config/config.json")["development"];

const db = new sqlz(config);
const dataType = sqlz.DataTypes;

module.exports = {db, dataType};

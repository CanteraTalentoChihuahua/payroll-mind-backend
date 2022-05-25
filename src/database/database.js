const sqlz = require("sequelize");
const config = require("../database/config/config.json")["development"];

const db = new sqlz(config);

module.exports = db;

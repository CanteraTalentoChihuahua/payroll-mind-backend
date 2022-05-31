const sqlz = require("sequelize");
const config = require("../database/config/config.json")[process.env.NODE_ENV || "localhost"];
const env = require("dotenv");

env.config();

const db = new sqlz(process.env.DATABASE_URL, config);
module.exports = db;

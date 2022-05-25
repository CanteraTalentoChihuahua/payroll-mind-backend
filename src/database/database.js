const sqlz = require("sequelize");

const db = new sqlz(process.env.DATABASE_URL);
module.exports = db;

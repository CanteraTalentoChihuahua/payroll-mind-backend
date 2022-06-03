import { Sequelize } from "sequelize";
const config = require("../database/config/config.json")[process.env.NODE_ENV || "localhost"];

const db = new Sequelize(process.env.DATABASE_URL!, config);
export default db;

import db from "../database/database";
import { NewUserData } from "../util/objects";
import { hash } from "bcrypt";
const sqlz = require("sequelize").Sequelize;
const user = require("../database/models/users")(db);

export async function getUsers() {
    return "placeholder text";
}
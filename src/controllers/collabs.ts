import db from "../database/database";
import { sequelize } from "../database/models";
const { Op } = require("sequelize");
const sqlz = require("sequelize").Sequelize;
const users = require("../database/models/users")(db);

export async function getUsers(businessUnitId: [number]) {
    console.log(" ");

    const userInfo = await users.findAll({
        where: {
            meta: {
                [Op.contains]: {
                    business_unit: {
                        business_unit_ids: businessUnitId
                    }
                }
            }
        }
    });

    return userInfo;

}

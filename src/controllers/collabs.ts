import db from "../database/database";
const sqlz = require("sequelize").Sequelize;
const users = require("../database/models/users")(db);

export async function getUsers(businessUnitId: string) {
    let userList;

    try {
        userList = await users.findAll({
            where: {
                "business_unit.business_unit_ids": businessUnitId
            }
        });

        return { isSuccessful: true, userList };

    } catch (error) {
        return { isSuccessful: false, userList };
    }
}

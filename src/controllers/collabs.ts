import db from "../database/database";
import { hash } from "bcrypt";
import { NewUserData } from "../util/objects";

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

        return { successful: true, userList };

    } catch (error) {
        return { successful: false, userList };
    }
}

// Especificar business unit
// Check if business unit is theirs
export async function createNewUser(userData: NewUserData, password: string) {
    try {
        await users.create({
            ...userData,
            business_unit: { business_unit_ids: [userData.business_unit] },
            on_leave: false,
            active: true,
            payment_period_id: userData.payment_period,
            role: "user",
            privileges: { privileges: [1] },
            password: await hash(password, 10)
        });

        return { successful: true };

    } catch {
        return { successful: false };
    }
}

const { users } = require("../database/models/index");
const { Op } = require("sequelize");

export async function getNewUsers(user_id: number, dateObject: unknown) {
    let newUsers;

    try {
        newUsers = await users.findAll({
            where: {
                id: { user_id },
                // @ts-ignore: Unreachable code error
                [Op.between]: [dateObject.initial_date, dateObject.final_date]
            }
        });

    } catch (error) {
        return { successful: true, error: "Query error at users." };
    }

    return { successful: true, newUsers };
}

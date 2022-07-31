const { users, indicators } = require("../database/models/index");
const { Op } = require("sequelize");

interface indicatorObject {
    new_users: undefined
    inactive_users: undefined | { inactive_users: Array<number> }
    month: undefined | number,
    year: undefined | number
}

export async function createIndicator(month: number, year: number) {
    let indicatorStatus;
    try {
        indicatorStatus = await indicators.create({
            month,
            year
        });

        if (indicatorStatus === 0) {
            return { successful: false, error: "Unable to create indcator row. May already exist." };
        }

    } catch (error) {
        return { successful: false, error: "Creation error at indicators." };
    }

    return { successful: true };
}

export async function updateIndicators(indicatorObject: indicatorObject) {
    try {
        await indicators.update({ ...indicatorObject });

    } catch (error) {
        return { successful: false, error: "Unable to update indicators table." };
    }

    return { successful: true };
}

// export async function getNewUsers(month: number, year: number) {
//     let newUsers;

//     try {
//         newUsers = await users.findAll({
//             offset,
//             limit,
//             where: {
//                 user_id,
//                 payment_date: {
//                     // @ts-ignore: Unreachable code error
//                     [Op.between]: [dateObject.initial_date, dateObject.final_date]
//                 },
//                 order: [["payment_date", "ASC"]]
//             },
//             raw: true
//         });

//     } catch (error) {
//         return { successful: true, error: "Query error at users." };
//     }

//     return { successful: true, newUsers };
// }

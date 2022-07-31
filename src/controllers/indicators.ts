const { users, indicators } = require("../database/models/index");
const { Op } = require("sequelize");

export async function createIndicator() {
    const currentDate = new Date();

    let indicatorStatus;
    try {
        indicatorStatus = await indicators.create({
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });

    } catch (error) {
        return { successful: false, error: "Creation error at indicators." };
    }

    return { successful: true };
}

export async function updateNewUsers(user_id: number) {
    console.log("GETTIN IN");


    const currentDate = new Date();
    const month = currentDate.getMonth() + 1, year = currentDate.getFullYear();

    let newUsersObject, newUsersArray;
    // Create newUsersArray
    try {
        newUsersObject = await indicators.findOne({
            where: { month, year },
            raw: true
        });

        if (newUsersObject) {
            const { new_users } = newUsersObject;

            if (new_users) {
                newUsersArray = new_users["new_users"];
                newUsersArray.push(user_id);

            } else {
                newUsersArray = [user_id];
            }
        }

    } catch (error) {
        console.log(error);
    }

    // Update indicators
    try {
        await indicators.update({ new_users: { new_users: newUsersArray } }, {
            where: { month, year }
        }, { returning: true });

    } catch (error) {
        return { successful: false, error: "Unable to update indicators table." };
    }

    return { successful: true };
}

export async function getNewUsers(month: number, year: number) {
    let newUsers;

    try {
        newUsers = await indicators.findAll({
            attributes: ["new_users"],
            where: {
                month,
                year
            },
            raw: true
        });

    } catch (error) {
        console.log(error);
        return { successful: false, error: "Query error at users." };
    }

    return { successful: true, newUsers: newUsers[0] };
}

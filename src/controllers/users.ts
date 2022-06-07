import db from "../database/database"
const sqlz = require("sequelize").Sequelize
const user = require("../database/models/users")(db)

function getOrder(order: string, by: string) {
    switch (order) {
        case "name": return [
            ["first_name", by],
            ["last_name", by]
        ]
        case "salary": return [
            ["salary", by]
        ]
        default: return []
    }
}

export async function getUsersList(order: string, by: string): Promise<{ successful: boolean; userList: object[] | undefined; }> {
    let userList;

    try {
        userList = await user.findAll({
            attributes: [
                "first_name",
                "last_name",
                ["payment_period_id", "payment_period"],
                [sqlz.json("business_unit.business_unit_ids"), "business_units"],
                "on_leave",
                "salary"
            ],
            order: getOrder(order, by)
        })
    } catch {
        return { successful: false, userList: undefined }
    }

    return { successful: true, userList }
}

export async function getUserDetails(id: number): Promise<{ successful: boolean; found: boolean; userDetails: object | undefined; }> {
    let userDetails;

    try {
        userDetails = await user.findOne({
            where: { id },
            attributes: [
                "first_name",
                "second_name",
                "last_name",
                "second_last_name",
                "email",
                "role",
                ["payment_period_id", "payment_period"],
                [sqlz.json("business_unit.business_unit_ids"), "business_units"],
                "on_leave",
                "active",
                "salary"
            ]
        })
    } catch {
        return { successful: false, found: false, userDetails: undefined }
    }

    return { successful: true, found: userDetails !== null, userDetails }
}
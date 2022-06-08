import db from "../database/database";
import { NewUserData } from "../util/objects";
import { hash } from "bcrypt";
const sqlz = require("sequelize").Sequelize;
const user = require("../database/models/users")(db);

function getOrder(order: string, by: string) {
    switch (order) {
    case "name": return [
        ["first_name", by],
        ["last_name", by]
    ];
    case "salary": return [
        ["salary", by]
    ];
    default: return [];
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
        });
    } catch {
        return { successful: false, userList: undefined };
    }

    return { successful: true, userList };
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
        });
    } catch {
        return { successful: false, found: false, userDetails: undefined };
    }

    return { successful: true, found: userDetails !== null, userDetails };
}

export async function createNewUser(userData: NewUserData, password: string) {
    try {
        await user.create({
            ...userData,
            business_unit: { business_unit_ids: [userData.business_unit] },
            on_leave: false,
            active: true,
            payment_period_id: userData.payment_period,
            role: "user",
            privileges: { privileges: [1] },
            password: await hash(password, 10)
        });
    } catch {
        return { successful: false };
    }

    return { successful: true };
}

export async function editUser(id: number, userData: Partial<NewUserData>) {
    let result;

    try {
        result = await user.update({
            ...userData,
            ...(userData.business_unit && { business_unit: { business_unit_ids: [userData.business_unit] } })
        }, { where: { id } });
    } catch {
        return { successful: false, found: false };
    }

    return { successful: true, found: result[0] === 1 };
}

export async function pseudoDeleteUser(id: number) {
    let result;

    try {
        result = await user.update({
            active: false
        }, { where: { id } });
    } catch {
        return { successful: false, found: false };
    }

    return { successful: true, found: result[0] === 1 };
}

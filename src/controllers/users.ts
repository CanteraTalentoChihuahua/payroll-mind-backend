import { NewUserData } from "../util/objects";
import { hash } from "bcrypt";

const { Op } = require("sequelize");
const sqlz = require("sequelize").Sequelize;
const { users: user,
    roles,
    business_units: businessUnits,
    pre_payments, salaries, payments_periods, payroll_schemas } = require("../database/models/index");

const attributesList = [
    "id",
    "first_name",
    "second_name",
    "last_name",
    "second_last_name",
    "birthday",
    "email",
    "phone_number",
    "role_id",
    "privileges",
    ["payment_period_id", "payment_period"],
    [sqlz.json("business_unit.business_unit_ids"), "business_units"],
    "on_leave",
    "active",
    "salary_id",
    "bank",
    "CLABE",
    "payroll_schema_id"
];

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

export function createUnitsListCondition(businessUnits: Array<number>) {
    const unitsList = [{ "business_unit.business_unit_ids": `[${String(businessUnits).replace(/,/g, ", ")}]` }];

    for (const i in businessUnits) {
        unitsList.push({ "business_unit.business_unit_ids": `[${businessUnits[parseInt(i)]}]` });
    }

    return unitsList;
}

export async function checkIfEmailExists(email: string) {
    let status;
    try {
        status = await user.findOne({
            where: { email }
        });

    } catch (error) {
        return false;
    }

    return status;
}

export async function getUsersList(order: string, by: string, businessUnits?: Array<number>): Promise<{ successful: boolean; userList: object[] | undefined; }> {
    let userList;
    const orderSet = getOrder(order, by);

    if (businessUnits === undefined) {
        try {
            userList = await user.findAll({
                attributes: attributesList,
                order: orderSet
            });

            return { successful: true, userList };

        } catch (error) {
            return { successful: false, userList: undefined };
        }
    }

    try {
        const unitsList = createUnitsListCondition(businessUnits);

        userList = await user.findAll({
            attributes: attributesList,
            where: {
                [Op.or]: unitsList,
                id: {
                    [Op.ne]: 1
                }
            },
            order: orderSet
        });

        return { successful: true, userList };

    } catch {
        return { successful: false, userList: undefined };
    }
}

export async function getUserDetails(id: number, businessUnits?: Array<number>): Promise<{ successful: boolean; found: boolean; userDetails: object | undefined; }> {
    let userDetails;
    let condition;

    try {
        if (businessUnits) {
            const unitsList = createUnitsListCondition(businessUnits);
            condition = { id, [Op.or]: unitsList };

        } else {
            condition = { id };
        }

        userDetails = await user.findOne({
            attributes: attributesList,
            where: condition
        });

    } catch (error) {
        return { successful: false, found: false, userDetails: undefined };
    }

    return { successful: true, found: userDetails !== null, userDetails };
}

export async function getAllUsersDataRaw() {
    let usersData;

    try {
        usersData = await user.findAll({
            attributes: ["id", "salary_id", "payment_period_id", "payroll_schema_id", "business_unit"],
            where: {
                active: true,
                [Op.not]: { id: 1 }
            },
            include: [
                { attributes: ["id", "salary"], model: salaries },
            ],
            order: [
                ["id", "ASC"]
            ]
        });

        if (!usersData) {
            return { successful: false, error: "User not found, may be inactive or invalid user." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, usersData };
}

export async function getUserData(id: number) {
    let userData;

    // What if double salary?
    try {
        userData = await user.findOne({
            attributes: ["id"],
            where: {
                id,
                active: true,
                [Op.not]: { id: 1 }
            },
            include: [
                { attributes: ["id", "name"], model: roles },
                { attributes: ["id", "salary"], model: salaries },
                { attributes: ["id", "name"], model: payroll_schemas },
                { attributes: ["id", "name"], model: payments_periods }
            ]
        });

        if (!userData) {
            return { successful: false, error: "User not found, may be inactive or invalid user." };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, userData };
}

// ADD PRIVILEGES SELECTION DEPENDING ON USER SPECIFICATION
export async function createNewUser(userData: NewUserData, password: string) {
    try {
        await user.create({
            ...userData,
            business_unit: { business_unit_ids: userData.business_unit_id },
            on_leave: false,
            active: true,
            privileges: { privileges: userData.privileges },
            password: await hash(password, 10)
        });

    } catch (error) {
        return { successful: false };
    }

    return { successful: true };
}

export async function editUser(id: number, userData: Partial<NewUserData>, businessUnits?: Array<number>) {
    let result;
    let condition;

    if (businessUnits) {
        const unitsList = createUnitsListCondition(businessUnits);
        condition = { id, [Op.or]: unitsList };

    } else {
        condition = { id };
    }

    try {
        result = await user.update({
            ...userData,
            ...(userData.business_unit_id && { business_unit: { business_unit_ids: userData.business_unit_id } }),
            privileges: { privileges: userData.privileges }
        }, { where: condition });

    } catch {
        return { successful: false, found: false };
    }

    return { successful: true, found: result[0] === 1 };
}

// No use of paranoid?
export async function pseudoDeleteUser(id: number, businessUnits?: Array<number>) {
    let result;
    let condition;

    if (businessUnits) {
        const unitsList = createUnitsListCondition(businessUnits);
        condition = { id, [Op.or]: unitsList };

    } else {
        condition = { id };
    }

    try {
        result = await user.update({ active: false }, {
            where: condition
        });

    } catch (error) {
        return { successful: false, found: false };
    }

    return { successful: true, found: result[0] === 1 };
}

export async function getPaymentPeriods() {
    let businessUnitData;

    try {
        businessUnitData = await businessUnits.findAll();

    } catch (error) {
        return false;
    }

    return businessUnitData;
}

export async function getRoleName(id: number) {
    let roleName;

    try {
        roleName = await roles.findOne({
            attributes: ["name"],
            where: { id }
        });

    } catch (error) {
        return null;
    }

    const { name } = roleName;
    return name;
}

export async function getNewUserId() {
    const max = await user.max("id");
    return parseInt(max);
}

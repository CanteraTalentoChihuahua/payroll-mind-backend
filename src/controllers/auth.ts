import db from "../database/database";
const users = require("../database/models/users")(db);
import { sign, verify, JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import transporter from "../config/mailer";
import bcrypt from "bcrypt";
import { createSessionJWT } from "../util/jwt";

export async function logIn(email: string, password: string) {
    const userData = await users.findOne({
        where: { email }
    });

    if (userData === null || userData.dataValues.password !== password) {
        return { loggedIn: false, token: null };
    }

    const token = createSessionJWT({
        id: userData.dataValues.id,
        role: userData.dataValues.role
    });

    const { first_name, role_id, privileges } = userData;

    return { loggedIn: Boolean(token), token, first_name, role_id, privileges };
}

export async function createURL(userId: number, purpose: string) {
    const token = sign({ userId, purpose }, process.env.JWT_SECRET!, {
        expiresIn: "10m",
    });

    // Set token to users 
    await users.update({ token }, {
        where: {
            id: userId
        }
    });

    return `${process.env.FRONT}/${purpose}/${token}`;
}

export async function generatePassword(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export async function sendPasswordRestoreEmail(id: number, email: string) {
    const urlToken = await createURL(id, "forgot");

    const message = {
        from: "Mind Group + <" + process.env.MAIL_ADDR + ">",
        to: email,
        subject: "Restore password",
        text: `Click on the following link to restore your password:\n ${urlToken}`,
    };

    try {
        const info = await transporter.sendMail(message);

        if (info.accepted[0] === email) {
            return { isSuccessful: true, result: info };
        }

    } catch (error) {
        return { isSuccessful: false };
    }
}

export async function sendPasswordChangeEmail(id: number, password: string, email: string) {
    const urlToken = await createURL(id, "restore");

    const message = {
        from: "Mind Group + <" + process.env.MAIL_ADDR + ">",
        to: email,
        subject: "Change credentials",
        text: `Welcome to Arkus Mind Group! Your credentials:\nemail: ${email} ; password: ${password}\nPlease change your password immediately via the following link: ${urlToken}`
    };

    try {
        const info = await transporter.sendMail(message);

        if (info.accepted[0] === email) {
            return { isSuccessful: true, result: info };
        }

    } catch (error) {
        return { isSuccessful: false };
    }
}

export async function invalidateToken(userId: string) {
    try {
        await users.update({ token: null }, {
            where: { id: userId }
        });
        return true;

    } catch (error) {
        return false;
    }
}

// Data contains token and new_password
export async function restorePassword(token: string, newPassword: string) {
    const payload = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!payload.purpose || payload.purpose !== "forgot") {
        throw new JsonWebTokenError("Token not valid");
    }

    const user = await users.findAll({
        where: { id: payload.userId }
    });

    if (token !== user[0].dataValues.token) {
        return { isSuccessful: true, result: false };
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await users.update({ password: hash }, {
        where: { id: payload.userId }
    });

    const invalidateStatus = await invalidateToken(payload.userId);

    if (invalidateStatus === true) {
        return { isSuccessful: true, result: true };

    } else {
        return { isSuccessful: true, result: false };
    }
}

import db from "../database/database";
const users = require("../database/models/users")(db);
import { sign, verify, JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import transporter from "../config/mailer";
import bcrypt from "bcrypt";
import { createSessionJWT } from "../util/jwt";

async function logIn(email: string, password: string) {
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

    await users.update({ token }, {
        where: { email }
    });

    const { id, first_name, role, privileges } = userData;

    return { loggedIn: Boolean(token), id, token, first_name, role, privileges };
}

async function createURL(userId: string, purpose: string) {
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

// Replace FRONT
async function sendPasswordEmail(email: string) {
    const userData = await users.findOne({
        where: { email }
    });

    if (userData === null) {
        return { isSuccessful: false };
    }

    const urlToken = await createURL(userData.id, "forgot");

    const message = {
        from: "Mind Group + <" + process.env.MAIL_ADDR + ">",
        to: email,
        subject: "Restore password",
        text: `Click on the following link to restore your password: ${urlToken}`,
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

async function invalidateToken(userId: string) {
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
async function restorePassword(token: string, newPassword: string) {
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

async function logOut(userId: string) {
    return await invalidateToken(userId);
}

export { logIn, logOut, sendPasswordEmail, restorePassword };

const { users } = require("../database/models/index");
import bcrypt from "bcrypt";
import transporter from "../config/mailer";
import { createSessionJWT } from "../util/jwt";
import { sign, verify, JsonWebTokenError, JwtPayload } from "jsonwebtoken";

export async function logIn(email: string, password: string) {
    const userData = await users.findOne({
        where: { email }
    });

    if (userData === null || !(await bcrypt.compare(password, userData.dataValues.password))) {
        return { loggedIn: false, token: null };
    }

    const token = createSessionJWT({
        id: userData.dataValues.id,
        role: userData.dataValues.role
    });

    const { id, first_name, role, privileges } = userData;

    return { loggedIn: Boolean(token), id, token, first_name, role, privileges };
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
    let payload;
    try {
        payload = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    } catch (error) {
        return { successful: false, message: "Unable to verify token." };
    }

    if (!payload.purpose || payload.purpose !== "forgot") {
        throw new JsonWebTokenError("Token not valid");
    }

    let user;
    try {
        user = await users.findAll({
            where: { id: payload.userId }
        });

    } catch (error) {
        return { successful: false, message: "No user found." };
    }

    if (token !== user[0].dataValues.token) {
        return { isSuccessful: true, result: false };
    }

    const hash = await bcrypt.hash(newPassword, 10);

    try {
        await users.update({ password: hash }, {
            where: { id: payload.userId }
        });

    } catch (error) {
        return { isSuccessful: false, message: "Error updating password." };
    }

    const invalidateStatus = await invalidateToken(payload.userId);
    if (invalidateStatus === true) {
        return { isSuccessful: true, result: true };
    } else {
        return { isSuccessful: true, result: false };
    }
}

import jwt from "../util/jwt";
import db from "../database/database";
const users = require("../database/models/users")(db);
import { sign, verify, JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import transporter from "../config/mailer";
import bcrypt from "bcrypt"

async function logIn(email: string, password: string) {
    const userData = await users.findOne({
        where: { email }
    });

    if (userData === null || userData.dataValues.password !== password) {
        return { loggedIn: false, token: null };
    }

    const token = jwt.createSessionJWT({
        id: userData.dataValues.id,
        role: userData.dataValues.role
    });

    return { loggedIn: Boolean(token), token };
}

async function createURL(userId:string, purpose:string) {
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
async function sendPasswordEmail(email:string) {
    const userData = await users.findOne({
        where: { email }
    });

    if (userData === null) {
        return { isSuccessful: false };
    }

    const urlToken = await createURL(userData.id, "forgot");

    let message = {
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

async function invalidateToken(userId:string) {
    try {
        await users.update({ token: null }, {
            where: { id: userId }
        });
        return true;

    } catch (error) {
        return false;
    }
}



export { logIn, sendPasswordEmail };

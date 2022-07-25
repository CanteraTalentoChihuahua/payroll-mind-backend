import { Request, Response } from "express";
import { verifySessionJWT } from "../util/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Privilege } from "../util/objects";
const { users } = require("../database/models/index");

export default (...privileges: Privilege[]) => {
    return async (req: Request, res: Response, next: () => unknown) => {
        const tokenMessage = "Missing or invalid session token";
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer")) {
            return res.status(401).json({ message: tokenMessage });
        }

        const tokenInfo = verifySessionJWT(token!.split(" ")[1]);

        if (!tokenInfo.isValid) {
            return res.status(401).json({ message: tokenMessage });
        }

        const userInfo = await users.findOne({
            where: {
                id: (tokenInfo.payload as JwtPayload).id
            }
        });

        if (userInfo === null) {
            return res.status(401).json({ message: tokenMessage });
        }

        let hasPrivileges = true;
        privileges.forEach((privilege: Privilege) => {
            hasPrivileges = hasPrivileges && (userInfo.privileges.privileges as number[]).find((val) => val === privilege.id) !== undefined;
        });

        if (!hasPrivileges) {
            return res.status(403).json({ message: "Missing required privileges" });
        }

        res.locals["userInfo"] = userInfo;
        next();
    };
};

import { Request, Response } from "express"
import { verifySessionJWT } from "../util/jwt"
import db from "../database/database"
import { JwtPayload } from "jsonwebtoken"
const users = require("../database/models/users")(db)

export default (...privileges: string[]) => {
    return (req: Request, res: Response, next: Function) => {
        const tokenMessage = "Missing or invalid session token"
        const token = req.headers.authorization

        if (!token || !token.startsWith("Bearer")) {
            return res.status(401).json({ message: tokenMessage })
        }

        const tokenInfo = verifySessionJWT(token!.split(" ")[1])

        if (!tokenInfo.isValid) {
            return res.status(401).json({ message: tokenMessage })
        }

        const userInfo = users.findOne({ where: { id: (tokenInfo.payload as JwtPayload).id } })

        if (userInfo === null) {
            return res.status(401).json({ message: tokenMessage })
        }

        let hasPrivileges = true
        privileges.forEach((privilege) => {
            hasPrivileges = hasPrivileges && (userInfo.privileges.privileges as string[]).find((val) => val === privilege) !== undefined
        })

        if (!hasPrivileges) {
            return res.status(403).json({ message: "Missing required privileges" })
        }

        res.locals["userInfo"] = userInfo
        next()
    }
}
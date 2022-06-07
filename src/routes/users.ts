import { Router } from "express";
import { getUserDetails, getUsersList } from "../controllers/users";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

const router = Router()

router.get("/users", async (req, res) => {
    const { order, by } = req.query
    const errors: string[] = []

    if (typeof order !== "undefined") {
        if (typeof order !== "string" || !["name", "salary"].includes(order)) {
            errors.push("order")
        }
    }

    if (typeof by !== "undefined") {
        if (typeof by !== "string" || !["asc", "desc"].includes(by)) {
            errors.push("by")
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Invalid parameters", errors })
    }

    const data = await getUsersList((order as string | undefined) ?? "name", ((by as string | undefined) ?? "asc").toUpperCase())

    if (!data.successful) {
        return res.sendStatus(500)
    }

    return res.json(data.userList)
})

router.get("/user", privileges(Privileges.CREATE_ADMIN), async (req, res) => {
    const { id } = req.query

    if (!id || typeof id !== "string" || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid or missing ID" })
    }

    const data = await getUserDetails(parseInt(id))

    if (!data.successful) {
        return res.sendStatus(500)
    }

    if (!data.found) {
        return res.sendStatus(404)
    }

    res.json(data.userDetails)
})

export default router
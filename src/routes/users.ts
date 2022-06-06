import { Router } from "express";
import { getUsersList } from "../controllers/users";

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

export default router
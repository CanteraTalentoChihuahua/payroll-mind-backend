import { Router } from "express";
import { getUsersList } from "../controllers/users";

const router = Router()

router.get("/users", async (_req, res) => {
    const data = await getUsersList()

    if (!data.successful) {
        return res.sendStatus(500)
    }

    return res.json(data.userList)
})

export default router
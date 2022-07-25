import { Router } from "express";
import * as c from "../controllers/jira";

const router = Router();

router.post("/installed", async (req, res) => {
    const {clientKey, sharedSecret, baseUrl} = req.body;

    try {
        await c.onInstalledCallback(baseUrl, clientKey, sharedSecret);
    } catch {
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

export default router;

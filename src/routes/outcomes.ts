import { Router } from "express";
import * as c from "../controllers/outcomes";

const router = Router();

router.post("/outcomes", async (req, res) => {
    const { name, automatic } = req.body;
    const data = { name, automatic, active: true };

    if (!name || typeof automatic !== "boolean") {
        return res.status(400).send("Either missing name or automatic is not boolean.");
    }

    const incomeObject = await c.createOutcome(data);

    if (!incomeObject.successful) {
        return res.status(500).send("Unable to create outcome.");
    }

    return res.sendStatus(200);
});

router.get("/outcomes", async (_req, res) => {
    try {
        return res.json(await c.getAllOutcomes());
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }
});

router.put("/outcomes", async (req, res) => {
    const { id, name, automatic, active } = req.body;

    if (!id || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Missing or invalid id" });
    }

    if (name) {
        if ((name as string).trim().length === 0) {
            return res.sendStatus(400);
        }
    }

    if (automatic) {
        if (typeof automatic !== "boolean") {
            return res.sendStatus(400);
        }
    }

    if (active) {
        if (typeof active !== "boolean") {
            return res.sendStatus(400);
        }
    }

    try {
        await c.editOutcome(parseInt(id), name, automatic, active);
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

router.delete("/outcomes", async (req, res) => {
    const { id } = req.body;

    if (!id || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Missing or invalid id" });
    }

    try {
        await c.deleteOutcome(parseInt(id));
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

router.post("/outcomes/assign", async (req, res) => {
    const { user_id, income_id: outcome_id, counter, amount, automatic } = req.body;

    if (!user_id || Number.isNaN(parseInt(user_id))) {
        return res.status(400).json({ message: "Missing or invalid user id" });
    }

    if (!outcome_id || Number.isNaN(parseInt(outcome_id))) {
        return res.status(400).json({ message: "Missing or invalid outcome id" });
    }

    if (!counter || Number.isNaN(parseInt(counter))) {
        return res.status(400).json({ message: "Missing or invalid counter amount" });
    }

    if (!amount || Number.isNaN(parseFloat(amount))) {
        return res.status(400).json({ message: "Missing or invalid amount" });
    }

    if (typeof automatic !== "boolean") {
        return res.status(400).json({ message: "Missing or invalid automatic value. Expecting a boolean here" });
    }

    try {
        await c.assignOutcome(user_id, outcome_id, counter, amount, automatic);
    } catch (e) {
        console.dir(e);
        return res.status(500).send(e);
    }

    res.sendStatus(204);
});

export default router;

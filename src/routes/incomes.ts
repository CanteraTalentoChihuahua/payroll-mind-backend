import { Router } from "express";
import * as c from "../controllers/incomes";

const router = Router();

router.post("/incomes", async (req, res) => {
    const { name, automatic } = req.body;

    if (!name || typeof automatic !== "boolean") {
        return res.sendStatus(400);
    }

    try {
        await c.createIncomeDated(name, automatic);
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    return res.sendStatus(201);
});

router.get("/incomes", async (_req, res) => {
    try {
        return res.json(await c.getAllIncomes());
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }
});

router.put("/incomes", async (req, res) => {
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
        await c.editIncome(parseInt(id), name, automatic, active);
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

router.delete("/incomes", async (req, res) => {
    const { id } = req.body;

    if (!id || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Missing or invalid id" });
    }

    try {
        await c.deleteIncome(parseInt(id));
    } catch (e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

router.post("/incomes/assign", async (req, res) => {
    const { user_id, income_id, counter, amount, automatic } = req.body;

    if (!user_id || Number.isNaN(parseInt(user_id))) {
        return res.status(400).json({ message: "Missing or invalid user id" });
    }

    if (!income_id || Number.isNaN(parseInt(income_id))) {
        return res.status(400).json({ message: "Missing or invalid income id" });
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
        await c.assignIncome(user_id, income_id, counter, amount, automatic);
    } catch (e) {
        console.dir(e);
        return res.status(500).send(e);
    }

    res.sendStatus(204);
});

export default router;

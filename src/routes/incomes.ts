import {Router} from "express";
import * as c from "../controllers/incomes";

const router = Router();

router.post("/incomes", async (req, res) => {
    const { name, automatic } = req.body;

    if (!name || typeof automatic !== "boolean") {
        return res.sendStatus(400);
    }

    try {
        await c.createIncome(name, automatic);
    } catch(e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    return res.sendStatus(201);
});

router.get("/incomes", async (_req, res) => {
    try {
        return res.json(await c.getAllIncomes());
    } catch(e) {
        console.dir(e);
        return res.sendStatus(500);
    }
});

router.put("/incomes", async (req, res) => {
    const {id, name, automatic, active} = req.body;

    if (!id || Number.isNaN(parseInt(id))) {
        return res.status(400).json({message:"Missing or invalid id"});
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
    } catch(e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

router.delete("/incomes", async (req, res) => {
    const {id} = req.body;

    if (!id || Number.isNaN(parseInt(id))) {
        return res.status(400).json({message:"Missing or invalid id"});
    }

    try {
        await c.deleteIncome(parseInt(id));
    } catch(e) {
        console.dir(e);
        return res.sendStatus(500);
    }

    res.sendStatus(204);
});

export default router;

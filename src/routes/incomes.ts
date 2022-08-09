import { Router } from "express";
import * as c from "../controllers/incomes";

const router = Router();

router.post("/incomes", async (req, res) => {
    const { name, automatic } = req.body;
    const data = { name, automatic, active: true };

    if (!name || typeof automatic !== "boolean") {
        return res.status(400).send("Either missing name or automatic is not boolean.");
    }

    const incomeObject = await c.createIncome(data);

    if (!incomeObject.successful) {
        return res.status(500).send("Unable to create income.");
    }

    return res.sendStatus(200);
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

router.post("/incomes/assign/:user_id", async (req, res) => {
    const { income_id, counter, amount, automatic } = req.body;
    const { user_id } = req.query;

    // @ts-ignore: Unreachable code error
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
        // @ts-ignore: Unreachable code error
        await c.assignIncome(user_id, income_id, counter, amount, automatic);
    } catch (e) {
        console.dir(e);
        return res.status(500).send(e);
    }

    return res.status(200).json({ message: `Successfully assigned income to user: ${user_id}` });
});

router.delete("/incomes_users/:user_id", async (req, res) => {
    const { user_id, incomes_users_array } = req.body;

    const a = await // @ts-ignore: Unreachable code error

});

export default router;

import { Router } from "express";
import { createNewUser, editUser, getUserDetails, getUsersList, pseudoDeleteUser } from "../controllers/users";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

// Admin should be limited to only create users roles
// Superadmin should not appear?

const router = Router();

router.get("/users", privileges(Privileges.READ_USERS), async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    const { order, by } = req.query;
    const errors: string[] = [];

    if (typeof order !== "undefined") {
        if (typeof order !== "string" || !["name", "salary"].includes(order)) {
            errors.push("order");
        }
    }

    if (typeof by !== "undefined") {
        if (typeof by !== "string" || !["asc", "desc"].includes(by)) {
            errors.push("by");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Invalid parameters", errors });
    }

    let data;
    if (role === "admin") {
        data = await getUsersList((order as string | undefined) ?? "name", ((by as string | undefined) ?? "asc").toUpperCase(), business_unit_ids);

    } else {
        data = await getUsersList((order as string | undefined) ?? "name", ((by as string | undefined) ?? "asc").toUpperCase());
    }

    if (!data.successful) {
        return res.sendStatus(500);
    }

    return res.json(data.userList);
});

router.get("/user", privileges(Privileges.CREATE_ADMIN), async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;
    const { id } = req.query;

    if (!id || typeof id !== "string" || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid or missing ID" });
    }

    let data;
    if (role === "admin") {
        data = await getUserDetails(parseInt(id), business_unit_ids);
    } else {
        data = await getUserDetails(parseInt(id));
    }

    if (!data.successful) {
        return res.sendStatus(500);
    }

    if (!data.found) {
        return res.sendStatus(404);
    }

    res.json(data.userDetails);
});

router.post("/user", privileges(Privileges.CREATE_USERS), async (req, res) => {
    const { first_name, last_name, email, payment_period, business_unit, salary, second_name, second_last_name, password } = req.body;

    if (!first_name || !last_name || !email || !payment_period || !business_unit || !salary || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (![1, 2].includes(payment_period) || ![1, 2].includes(business_unit) || Number.isNaN(parseFloat(salary))) {
        return res.status(400).json({ message: "Invalid data sent on some fields" });
    }

    const data = await createNewUser({ first_name, last_name, email, payment_period, business_unit, salary, second_name, second_last_name }, password);

    if (!data.successful) {
        return res.sendStatus(500);
    }

    res.status(201).json({ message: "User created successfully" });
});

router.put("/user", privileges(Privileges.EDIT_USERS), async (req, res) => {
    const { id, first_name, last_name, email, payment_period, business_unit, salary, second_name, second_last_name } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (Number.isNaN(parseInt(id)) || Number.isNaN(parseFloat(salary))) {
        return res.status(400).json({ message: "Invalid data sent on some fields" });
    }

    if (payment_period) {
        if (![1, 2].includes(payment_period)) {
            return res.status(400).json({ message: "Invalid data sent on some fields" });
        }
    }

    if (business_unit) {
        if (![1, 2].includes(business_unit)) {
            return res.status(400).json({ message: "Invalid data sent on some fields" });
        }
    }

    const data = await editUser(id, { first_name, last_name, email, payment_period, business_unit, salary, second_name, second_last_name });

    if (!data.successful) {
        return res.sendStatus(500);
    }

    if (!data.found) {
        return res.sendStatus(404);
    }

    res.sendStatus(204);
});

router.delete("/user", privileges(Privileges.DELETE_USERS), async (req, res) => {
    const { id } = req.query;

    if (!id || typeof id !== "string" || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid or missing ID" });
    }

    const data = await pseudoDeleteUser(parseInt(id));

    if (!data.successful) {
        return res.sendStatus(500);
    }

    if (!data.found) {
        return res.sendStatus(404);
    }

    res.sendStatus(204);
});

export default router;

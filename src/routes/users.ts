import { Router } from "express";
import { createNewUser, editUser, getUserDetails, getUsersList, pseudoDeleteUser } from "../controllers/users";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

// Admin should be limited to only create users roles - no other admins
// Superadmin should not appear when GET? x
// Limited to [1, 2]???
// Admin should always be id=1
// Should superadmin be assigned to all business units? Yes

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
        // Admin can't query superuser data
        if (parseInt(id) === 1) {
            return res.status(400).json({ message: "Invalid request" });
        }

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
    let { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    const { first_name, last_name, email, payment_period, salary, second_name, second_last_name, password } = req.body;
    const new_user_business_unit = req.body.business_unit;
    const new_user_role = req.body.role;

    if (role === "admin") {
        if (!business_unit_ids.includes(new_user_business_unit) || new_user_role !== "collab") {
            return res.status(400).json({
                message: "Invalid request"
            });
        }

    } else {
        if (new_user_role === "superadmin") {
            return res.status(400).json({
                message: "Invalid request"
            });
        }
    }

    if (!first_name || !last_name || !email || !payment_period || !business_unit || !salary || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (![1, 2].includes(payment_period) || ![1, 2].includes(new_user_business_unit) || Number.isNaN(parseFloat(salary))) {
        return res.status(400).json({ message: "Invalid data sent on some fields" });
    }

    business_unit = new_user_business_unit;
    role = new_user_role;
    const data = await createNewUser({ first_name, last_name, email, payment_period, business_unit, role, salary, second_name, second_last_name }, password);

    if (!data.successful) {
        return res.sendStatus(500);
    }

    res.status(201).json({ message: "User created successfully" });
});

// Admins cannot change password.
// As an admin you can only edit those that belong to your business unit
// Admin cannot edit superuser
// Superuser is always 1
// TO DO: Admin cannot change his own salary --- add superadmin validation in the future
// HINT: Superadmin salary is invalid anyway, modification won't matter 
// EDIT_OWN PRIVILEGE 
router.put("/user", privileges(Privileges.EDIT_USERS), async (req, res) => {
    let { id, business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    const { first_name, last_name, email, payment_period, salary, second_name, second_last_name } = req.body;
    const new_user_business_unit = req.body.business_unit;
    const req_id = req.body.business_unit;

    if (!req_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (role === "admin") {
        // Cannot edit superadmin 
        if (id === 1) {
            return res.status(400).json({ message: "Invalid request." })
        }

        // Cannot edit own salary as admin
        if (salary && id === req_id) {
            return res.status(400).json({ message: "Invalid request." })
        }
    }

    if (Number.isNaN(parseInt(id)) || Number.isNaN(parseFloat(salary))) {
        return res.status(400).json({ message: "Invalid data sent on some fields" });
    }

    if (payment_period) {
        if (![1, 2].includes(payment_period)) {
            return res.status(400).json({ message: "Invalid data sent on some fields" });
        }
    }

    if (new_user_business_unit) {
        if (!business_unit_ids.includes(new_user_business_unit)) {
            return res.status(400).json({ message: "Invalid request" });
        }
    }

    business_unit = new_user_business_unit;
    const data = await editUser(id, { first_name, last_name, email, payment_period, business_unit, role, salary, second_name, second_last_name });

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

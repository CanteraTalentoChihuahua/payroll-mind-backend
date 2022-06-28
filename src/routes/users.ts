import { Router } from "express";
// import { sendPasswordEmail } from "../controllers/auth";
import { createNewUser, editUser, getUserDetails, getUsersList, pseudoDeleteUser, checkIfEmailExists, getRoleName } from "../controllers/users";
import { generatePassword } from "../controllers/auth";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

// Note: ADMIN SHOULD ALWAYS BE 1 AND ASSIGNED TO ALL BUSINESS UNITS
// TO DO: EMAIL SHOULD NOT BE REPEATED
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

// --FORMAT DATE?
// FRONT MUST CALL /CHANGE AFTER CREATION DUE TO EMAIL
// first_name, second_name, last_name, second_last_name
// birthday, email, phone_number, role_id, privileges, payment_period_id, business_unit, on_leave, active, salary_id, bank, CLABE, payroll_schema_id, 
// MUST CREATE PAYROLL SCHEMA ENDPOINT
// Privileges, password, on_leave, active are given
router.post("/user", privileges(Privileges.CREATE_USERS), async (req, res) => {
    let { role_id } = res.locals.userInfo;
    const { business_unit } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    // Required
    const { first_name, last_name, birthday, email, phone_number, payment_period_id, salary_id, business_unit_id, bank, CLABE, payroll_schema_id } = req.body;
    const new_role_id = req.body.role_id;

    // Optional
    const { second_name, second_last_name } = req.body;

    // Required validation
    if (!first_name || !last_name || !email || !birthday || !email || !phone_number || !new_role_id || !payment_period_id || !salary_id || !business_unit_id || !bank || !CLABE || !payroll_schema_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Change business unit, add req data
    if (![1, 2].includes(payment_period_id) || !business_unit_ids.includes(business_unit_id)) {
        return res.status(400).json({ message: "Invalid data sent on some fields" });
    }

    // Check role...
    const newUserRole = await getRoleName(role_id);
    const currentUserRole = await getRoleName(new_role_id);

    if (currentUserRole === "admin") {
        if (!business_unit_ids.includes(business_unit_id) || newUserRole !== "collab") {
            return res.status(400).json({ message: "Invalid request" });
        }

    } else {
        if (newUserRole === "superadmin") {
            return res.status(400).json({ message: "Invalid request" });
        }
    }

    // Initial password is generated automatically
    role_id = new_role_id;
    const newPass = await generatePassword(30);
    const data = await createNewUser({ first_name, last_name, birthday, email, phone_number, role_id, payment_period_id, salary_id, business_unit_id, bank, CLABE, payroll_schema_id, second_name, second_last_name }, newPass);

    if (!data.successful) {
        return res.sendStatus(500);
    }

    res.status(201).json({ message: "User created successfully" });
});

// TO DO: Admin cannot change his own salary --- add superadmin validation in the future
// Admin cannot change password...
// NOTE: Superadmin salary is invalid anyway, modification won't matter
router.put("/user/:id", privileges(Privileges.EDIT_USERS), async (req, res) => {
    // Current user
    const { role_id, business_unit } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;
    const { id } = req.params;

    // Optional 
    const { first_name, second_name, last_name, second_last_name, birthday, email, phone_number, privileges, payment_period_id, on_leave, active, salary_id, business_unit_id, bank, CLABE, payroll_schema_id } = req.body;
    const editUserRoleId = req.body.params;
    const editUserId = req.body.id;

    if (!editUserId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (Number.isNaN(parseInt(editUserId))) {
        return res.status(400).json({ message: "Invalid data sent on id. Must be integer." });
    }

    // Check role...
    const currentUserRole = await getRoleName(role_id);
    let editUserRole;

    if (editUserRoleId) {
        editUserRole = await getRoleName(editUserId);
    }

    // CURRENTLY HANDLES JUST A BUSINESS UNIT - Needs to check for array in case of assigning multiple bunits
    if (business_unit_id) { 
        if (Number.isNaN(parseInt(business_unit_id))) {
            return res.status(400).json({ message: "Invalid data sent on business_unit. Must be integer or array." });
        }

        // New business unit must be within admin's
        if (currentUserRole === "admin") {
            if (!business_unit_ids.includes(business_unit_id) || editUserRole !== "collab") {
                return res.status(400).json({ message: "Invalid request" });
            }
        }
    }

    // Invalid datatypes
    if (salary_id) {
        if (Number.isNaN(parseInt(salary_id))) {
            return res.status(400).json({ message: "Invalid data sent on salary_id. Must be integer." });
        }
    }

    if (payment_period_id) {
        if (Number.isNaN(parseInt(payment_period_id))) {
            return res.status(400).json({ message: "Invalid data sent on payment_period_id. Must be integer." });
        }
    }

    if (payroll_schema_id) {
        if (Number.isNaN(parseInt(payroll_schema_id))) {
            return res.status(400).json({ message: "Invalid data sent on payment_period_id. Must be integer." });
        }
    }

    // Handle active, on leave

    // How to check privileges???
    // if (privileges) {
    //     if (Number.isNaN(parseFloat(privileges))) {
    //         return res.status(400).json({ message: "Invalid data sent on privileges" });
    //     }
    // }

    let userData;
    if (currentUserRole === "admin") {
        // Cannot edit superadmin 
        if (editUserId === 1) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // Cannot edit own salary as admin
        if (salary_id && id === editUserId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // Redifine vars, thanks typescript
        userData = await editUser(editUserId, { first_name, last_name, birthday, email, phone_number, role_id, payment_period_id, salary_id, business_unit_id, bank, CLABE, payroll_schema_id, second_name, second_last_name }, business_unit_ids);

    } else {
        userData = await editUser(editUserId, { first_name, last_name, birthday, email, phone_number, role_id, payment_period_id, salary_id, business_unit_id, bank, CLABE, payroll_schema_id, second_name, second_last_name });
    }

    if (!userData.successful) {
        return res.sendStatus(500);
    }

    if (!userData.found) {
        return res.sendStatus(404);
    }

    res.sendStatus(200);
});

router.delete("/user/:id", privileges(Privileges.DELETE_USERS), async (req, res) => {
    const { business_unit, role_id } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;
    const { id } = req.params;

    if (!id || typeof id !== "string" || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid or missing ID" });
    }

    // Superadmin cannot be destroyed
    if (parseInt(id) === 1) {
        return res.status(400).json({ message: "Invalid request" });
    }

    // Check role...
    const currentUserRole = await getRoleName(role_id);

    let userData;
    if (currentUserRole === "admin") {
        userData = await pseudoDeleteUser(parseInt(id), business_unit_ids);

    } else {
        userData = await pseudoDeleteUser(parseInt(id));
    }

    if (!userData.successful) {
        return res.sendStatus(500);
    }

    if (!userData.found) {
        return res.status(400).json({ message: "Not found or invalid request" });
    }

    return res.status(200).json({ message: "Successfully deleted user" });
});

export default router;

import { createNewUser, editUser, getUserDetails, getUsersList, pseudoDeleteUser, getRoleName } from "../controllers/users";
import { generatePassword } from "../controllers/auth";
import { createSalary } from "../controllers/payroll";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";
import { Router } from "express";

// Note: ADMIN SHOULD ALWAYS BE 1 AND ASSIGNED TO ALL BUSINESS UNITS
// TO DO: EMAIL SHOULD NOT BE REPEATED
const router = Router();

router.get("/users", privileges(Privileges.READ_USERS, Privileges.READ_COLLABORATORS), async (req, res) => {
    const { business_unit, role_id } = res.locals.userInfo;
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
    const role = await getRoleName(role_id);
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

router.get("/user/:id", privileges(Privileges.READ_USERS, Privileges.READ_COLLABORATORS), async (req, res) => {
    const { business_unit, role_id } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;
    const { id } = req.params;

    if (!id || typeof id !== "string" || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid or missing ID" });
    }

    let data;
    const currentUserRole = await getRoleName(role_id);
    if (currentUserRole === "admin") {
        // Admin can't query superuser data
        if (parseInt(id) === 1) {
            return res.status(400).json({ message: "Invalid request." });
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
// Privileges, password, on_leave, active are given
router.post("/user", privileges(Privileges.CREATE_ADMINS, Privileges.CREATE_COLLABORATORS, Privileges.REACTIVATE_COLLABORATORS, Privileges.REACTIVATE_ADMINS), async (req, res) => {
    let { role_id } = res.locals.userInfo;
    const { business_unit } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    // Required
    const { first_name, last_name, birthday, email, phone_number, payment_period_id, salary, business_unit_id, bank, CLABE, payroll_schema_id } = req.body;
    const new_role_id = req.body.role_id;

    // Optional
    const { second_name, second_last_name } = req.body;

    // Required validation
    if (!first_name || !last_name || !email || !birthday || !email || !phone_number || !new_role_id || !payment_period_id || !salary || !business_unit_id || !bank || !CLABE || !payroll_schema_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Change business unit, add req data
    if (![1, 2].includes(payment_period_id) || !Array.isArray(business_unit_id)) {
        return res.status(400).json({ message: "Invalid data sent on some fields" });
    }

    // Check roles
    const newUserRole = await getRoleName(new_role_id);
    const currentUserRole = await getRoleName(role_id);

    if (currentUserRole === "admin") {
        let doesNotBelongToBusinessUnits;
        business_unit_id.forEach(businessUnit => {
            if (!business_unit_ids.includes(businessUnit)) {
                doesNotBelongToBusinessUnits = true;
            }
        });

        // Possible break here
        if (doesNotBelongToBusinessUnits || ["collab", "admin"].includes(newUserRole)) {
            return res.status(400).json({ message: "Business unit of scope OR attempting to create superadmin." });
        }

    } else {
        if (newUserRole === "superadmin") {
            return res.status(400).json({ message: "Superadmin cannot create superadmin." });
        }
    }

    // Initial password is generated automatically
    const newPass = await generatePassword(30);

    // Create salary entry --- MUST EXTRACT USER ID --- MUST BE AFTER CREATENEWUSER
    const salaryData = await createSalary(role_id, salary);
    if (!salaryData.successful) {
        return res.status(500).send("Something went wrong. Unable to create salary.");
    }

    // Create user... CHANGE PRIVILEGES?
    role_id = new_role_id;
    const on_leave = false, active = true, salary_id = 1, privileges: Array<number> = [];
    const data = await createNewUser({ first_name, last_name, birthday, email, phone_number, role_id, privileges, payment_period_id, on_leave, active, salary_id, business_unit_id, bank, CLABE, payroll_schema_id, second_name, second_last_name }, newPass);

    if (!data.successful) {
        return res.status(500).json({ message: "Something went wrong. Fields might be duplicated." });
    }

    res.status(201).json({ message: "User created successfully." });
});

// TO DO: Admin cannot change his own salary --- add superadmin validation in the future
router.put("/user/:id", privileges(Privileges.EDIT_ADMINS, Privileges.EDIT_COLLABORATORS, Privileges.REACTIVATE_COLLABORATORS), async (req, res) => {
    // Current user
    const { role_id, business_unit } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;
    const currentUserId = role_id;

    // Optional 
    const { first_name, second_name, last_name, second_last_name, birthday, email, phone_number, privileges, payment_period_id, on_leave, active, salary_id, business_unit_id, bank, CLABE, payroll_schema_id } = req.body;
    const editUserRoleId = req.body.role_id;
    const editUserId = req.params.id;

    // Must specify user to edit, cannot be superadmin
    if (!editUserId || parseInt(editUserId) === 1) {
        return res.status(400).json({ message: "Invalid request." });
    }

    if (Number.isNaN(parseInt(editUserId))) {
        return res.status(400).json({ message: "Invalid data sent on id. Must be integer." });
    }

    // Check role of currentUser and editedUser, if exists...
    const currentUserRole = await getRoleName(parseInt(currentUserId));
    let editUserRole;

    if (editUserRoleId) {
        editUserRole = await getRoleName(parseInt(editUserRoleId));

        console.log(editUserRole);
        // Vulnerability?
        if (currentUserRole === "admin" && !["collab", "admin"].includes(editUserRole)) {
            return res.status(400).json({ message: "Invalid request. Cannot create superadmin or admin." });
        }

    }

    // Must be array
    if (business_unit_id) {
        if (!Array.isArray(business_unit_id)) {
            return res.status(400).json({ message: "Invalid data sent on business_unit. Must be array." });
        }

        let doesNotBelongToBusinessUnits;
        business_unit_id.forEach((businessUnit: number) => {
            if (!business_unit_ids.includes(businessUnit)) {
                doesNotBelongToBusinessUnits = true;
            }
        });

        if (doesNotBelongToBusinessUnits) {
            return res.status(400).json({ message: "Invalid request. Out of scope business unit." });
        }
    }

    // Invalid datatypes
    if (salary_id) {
        if (Number.isNaN(parseInt(salary_id))) {
            return res.status(400).json({ message: "Invalid data sent on salary_id. Must be integer." });
        }

        // Cannot edit own salary as admin
        if (currentUserId == editUserId) {
            return res.status(400).json({ message: "Invalid request. Cannot edit own salary." });
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

    // MUST BE TEXT
    if (active !== undefined) {
        if (![false, true].includes(active)) {
            return res.status(400).json("Invalid data sent on active. Must be true or false.");
        }
    }

    if (on_leave !== undefined) {
        if (![false, true].includes(on_leave)) {
            return res.status(400).json("Invalid data sent on on_leave. Must be true or false.");
        }
    }

    // Must be array
    if (privileges) {
        if (!Array.isArray(privileges)) {
            return res.status(400).json("Invalid data sent on privileges. Must be array.");
        }
    }

    let userData;
    const objectToEdit = { first_name, last_name, birthday, email, phone_number, role_id, payment_period_id, on_leave, active, salary_id, business_unit_id, bank, CLABE, payroll_schema_id, second_name, second_last_name };

    if (currentUserRole === "admin") {
        userData = await editUser(parseInt(editUserId), objectToEdit, business_unit_ids);
    } else {
        userData = await editUser(parseInt(editUserId), objectToEdit);
    }

    if (!userData.successful) {
        return res.sendStatus(500);
    }

    if (!userData.found) {
        return res.sendStatus(404);
    }

    res.status(200).json({ message: "User edited succesfully." });
});

router.delete("/user/:id", privileges(Privileges.DELETE_COLLABORATORS, Privileges.DELETE_ADMINS), async (req, res) => {
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

router.post("/trial", async (req, res) => {
    const { user_id, salary } = req.body;

    const salaryData = await createSalary(user_id, salary);
    if (!salaryData.successful) {
        return res.status(500).send("Something went wrong. Unable to create salary.");
    }

    return res.status(200).send("Works");
});

export default router;

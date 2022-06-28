import { Router } from "express";
// import { sendPasswordEmail } from "../controllers/auth";
import { createNewUser, getUserDetails, getUsersList, pseudoDeleteUser, checkIfEmailExists, getRoleName } from "../controllers/users";
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
    const { business_unit } = res.locals.userInfo;
    let { role_id } = res.locals.userInfo;
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
// NOTE: Superadmin salary is invalid anyway, modification won't matter
// router.put("/user", privileges(Privileges.EDIT_USERS), async (req, res) => {
//     const { id, role } = res.locals.userInfo;
//     let { business_unit } = res.locals.userInfo;
//     const { business_unit_ids } = business_unit;

//     const { first_name, last_name, email, payment_period_id, salary, second_name, second_last_name } = req.body;
//     const req_id = req.body.id;
//     business_unit = req.body.business_unit;

//     if (!req_id) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (Number.isNaN(parseInt(req_id))) {
//         return res.status(400).json({ message: "Invalid data sent on some fields" });
//     }

//     if (salary) {
//         if (Number.isNaN(parseFloat(salary))) {
//             return res.status(400).json({ message: "Invalid data sent on some fields" });
//         }
//     }

//     if (payment_period_id) {
//         if (![1, 2].includes(parseInt(payment_period_id))) {
//             return res.status(400).json({ message: "Invalid data sent on some fields" });
//         }
//     }

//     let userData;
//     if (role === "admin") {
//         // Cannot edit superadmin 
//         if (req_id === 1) {
//             return res.status(400).json({ message: "Invalid request" });
//         }

//         // Cannot edit own salary as admin
//         if (salary && id === req_id) {
//             return res.status(400).json({ message: "Invalid request" });
//         }

//         userData = await editUser(req_id, { first_name, last_name, email, payment_period_id, business_unit, role, salary, second_name, second_last_name }, business_unit_ids);

//     } else {
//         userData = await editUser(req_id, { first_name, last_name, email, payment_period_id, business_unit, role, salary, second_name, second_last_name });
//     }

//     if (!userData.successful) {
//         return res.sendStatus(500);
//     }

//     if (!userData.found) {
//         return res.sendStatus(404);
//     }

//     res.sendStatus(200);
// });

router.delete("/user", privileges(Privileges.DELETE_USERS), async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;
    const { id } = req.query;

    if (!id || typeof id !== "string" || Number.isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid or missing ID" });
    }

    // Superadmin cannot be destroyed
    if (parseInt(id) === 1) {
        return res.status(400).json({ message: "Invalid request" });
    }

    let userData;
    if (role === "admin") {
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

    return res.sendStatus(204);
});

export default router;

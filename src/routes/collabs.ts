import { Router } from "express";
import { createNewUser, getUsers } from "../controllers/collabs";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

const collabRouter = Router();

// Can't we call a role check at users.ts to avoid using different endpoints
// for the same functionality?
// Create a manage a modify business unit privilege (validation) for this ^ 
// 

collabRouter.get("/", privileges(Privileges.READ_USERS), async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    if (role !== "admin") {
        return res.status(400).json({
            message: "Invalid credentials."
        });
    }

    const reqSyntax = `[${business_unit_ids}]`;
    const data = await getUsers(reqSyntax);

    if (!data.successful) {
        return res.status(500).json({
            message: "Try again later..."
        });
    }

    res.status(200).send(data.userList);
});

// Define privileges
collabRouter.post("/", async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;

    if (role !== "admin") {
        return res.status(400).json({
            message: "Invalid credentials."
        });
    }

    const { first_name, last_name, email, payment_period, salary, second_name, second_last_name, password } = req.body;

    if (!first_name || !last_name || !email || !payment_period || !salary || !password) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    const data = await createNewUser({
        first_name, last_name, email, payment_period, business_unit, salary, second_name, second_last_name
    }, password);

    if (!data.successful) {
        return res.sendStatus(500).json({
            message: "Try again later..."
        });
    }

    res.status(201).json({
        message: "User created successfully"
    });
});


export default collabRouter;

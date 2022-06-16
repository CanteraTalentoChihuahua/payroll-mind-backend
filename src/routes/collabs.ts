import { Router } from "express";
import { getUsers } from "../controllers/collabs";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

const collabRouter = Router();

// Can't we call a role check at users.ts to avoid using different endpoints
// for the same functionality?

collabRouter.get("/", privileges(Privileges.READ_USERS), async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    if (role !== "admin") {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    const reqSyntax = `[${business_unit_ids}]`;
    const data = await getUsers(reqSyntax);

    if (!data.isSuccessful) {
        return res.status(500).json({
            message: "Try again later..."
        });
    }

    res.status(200).send(data.userList);
});

// Define privileges
collabRouter.post("/", async (req, res) => {
    const { role } = res.locals.userInfo;

    if (role !== "admin") {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }



});


export default collabRouter;

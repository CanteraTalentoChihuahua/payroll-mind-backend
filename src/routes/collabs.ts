import { Router } from "express";
import { getUsers } from "../controllers/collabs";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

const collabRouter = Router();

collabRouter.get("/", privileges(Privileges.READ_USERS), async (req, res) => {
    const { business_unit, role } = res.locals.userInfo;
    const { business_unit_ids } = business_unit;

    if (role !== "admin") {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    try {
        const users = await getUsers(business_unit_ids);
        return res.status(200).send(users);

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Try again later..."
        });
    }
});

export default collabRouter;

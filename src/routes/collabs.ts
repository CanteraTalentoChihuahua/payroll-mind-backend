import { Router } from "express";
import { getUsers } from "../controllers/collabs";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

const collabRouter = Router();


collabRouter.get("/", privileges(Privileges.READ_USERS), (req, res) => {
    const { business_units, role } = res.locals.userInfo;

    if (role !== "admin") {
        res.status(400).json({
            message: "Invalid credentials"
        });
    }

    try {
        const users = await getUsers();
        res.status(200).send(users);

    } catch (error) {
        res.status(500).send({
            message: "Try again later..."
        })
    }
});

export default collabRouter;
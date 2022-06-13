import { Router } from "express";
import { createNewUser, editUser, getUserDetails, getUsersList, pseudoDeleteUser } from "../controllers/users";
import privileges from "../middleware/privileges";
import { Privileges } from "../util/objects";

const collabRouter = Router();


collabRouter.get("/", privileges(Privileges.READ_USERS), (req, res) => {

    try {
        res.status(200).send(res.locals.userInfo);

    } catch (error) {
        res.status(404).send("Not working...");
    }


});

export default collabRouter;
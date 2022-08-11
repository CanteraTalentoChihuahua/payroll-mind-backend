import express from "express";
import { checkIfEmailExists } from "../controllers/users";
import { sendPasswordChangeEmail } from "../controllers/auth";
import { logIn, sendPasswordRestoreEmail, restorePassword } from "../controllers/auth";

// TO DO: ADD LOGIC SO THAT ID=1 EMAIL CANT BE CHANGED

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const tokenData = await logIn(email, password);

    if (!tokenData.loggedIn) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const privilegesObject = tokenData.privileges;
    
    return res.status(200).json({
        id: tokenData.id,
        token: tokenData.token,
        first_name: tokenData.first_name,
        role_id: tokenData.role,
        privileges: privilegesObject.privileges
    });
});

router.post("/forgot", async (req, res) => {
    const { email } = req.body;

    const userStatus = await checkIfEmailExists(email);
    if (!userStatus) {
        return res.sendStatus(404);
    }

    const emailStatus = await sendPasswordRestoreEmail(userStatus.id, email);
    if (emailStatus!.isSuccessful) {
        return res.status(200).send({ message: "Email sent." });

    } else {
        return res.status(500).send({ message: "Unable to send email." });
    }
});

router.post("/change", async (req, res) => {
    const { email } = req.body;

    const userStatus = await checkIfEmailExists(email);
    if (!userStatus) {
        return res.sendStatus(404);
    }

    const emailStatus = await sendPasswordChangeEmail(userStatus.id, userStatus.password, email);

    if (emailStatus!.isSuccessful) {
        res.status(200).send("Email sent.");

    } else {
        res.status(500).send("Unable to send email.");
    }
});

// Data contains token and new_password
router.post("/restore", async (req, res) => {
    const { token, newPassword } = req.body;
    const restore = await restorePassword(token, newPassword);

    if (!restore.isSuccessful) {
        return res.status(500).json(restore.message);
    }

    if (!restore.result) {
        return res.status(403).json({ message: "Unable to change password. Invalid credentials." });
    }

    return res.status(200).json({ message: "Password changed correctly." });
});

export default router;

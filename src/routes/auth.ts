import { Privileges } from "../util/objects";
import express from "express";
import {
    logIn,
    sendPasswordEmail,
    restorePassword,
    logOut
} from "../controllers/auth";

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

    res.json({
        token: tokenData.token,
        first_name: tokenData.first_name,
        role: tokenData.role,
        privileges: privilegesObject.privileges
    });
});

router.post("/logout", async (req, res) => {
    try {
        const { userId } = req.body;

        const logResult = await logOut(userId);

        if (logResult === true) {
            res.status(200).json({
                message: "Logged out successfully."
            });

        } else {
            res.status(404).json({
                message: "User not found."
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Invalid request."
        });
    }
});

router.post("/forgot", async (req, res) => {
    const { email } = req.body;
    const emailStatus = await sendPasswordEmail(email);

    if (emailStatus!.isSuccessful === true) {
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
        return res.status(500).json({ message: "Unable to change password. Try again later..." });
    }

    if (!restore.result) {
        return res.status(403).json({ message: "Unable to change password. Invalid credentials." });
    }

    return res.status(200).json({ message: "Password changed correctly." });
});

router.get("/privileges", async (req, res) => {
    try {
        res.status(200).send(Privileges);
    } catch (error) {
        res.status(503).json({ message: "Unable to send privileges." });
    }

});

export default router;

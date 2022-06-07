import express from "express";
import {
    logIn,
    sendPasswordEmail,
    restorePassword
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

router.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body;
        const emailStatus = await sendPasswordEmail(email);

        if (emailStatus!.isSuccessful === true) {
            res.status(200).send("Email sent.");
        }

    } catch (error) {
        res.status(500).send("Unable to send email.");
    }
});

// Data contains token and new_password
router.post("/restore", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const restore = await restorePassword(token, newPassword);

        if (!restore.isSuccessful) {
            return res.status(500).json({
                message: "Unable to change password."
            });
        }

        if (!restore.result) {
            return res.status(403).json({
                message: "Unable to change password."
            });
        }

        return res.status(200).json({
            message: "Password changed correctly."
        });

    } catch (error) {
        return res.status(403).json({
            message: "Invalid credentials. Unable to change password."
        });
    }
});


export default router;

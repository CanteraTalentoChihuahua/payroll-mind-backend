import express from "express";
import {
    logIn,
    sendPasswordEmail
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

    res.json({ token: tokenData.token });
});

router.post("/forgot", async (req, res) => {
    const { email } = req.body;
    const emailStatus = await sendPasswordEmail(email);

    console.log("Works??")

    if (emailStatus!.isSuccessful === true) {
        res.status(200).send("Email sent.");

    } else {
        res.status(500).send("Unable to send email.");
    }
});



export default router;

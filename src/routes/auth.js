const express = require("express");
const controller = require("../controllers/auth");
const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const tokenData = controller.logIn(email, password);

    if (!tokenData.loggedIn) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    res.json({ token: tokenData.token });
});

module.exports = router;

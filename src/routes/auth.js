const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username !== "testuser" || password !== "testpass") {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    res.json({ token: "testtoken" });
});

module.exports = router;

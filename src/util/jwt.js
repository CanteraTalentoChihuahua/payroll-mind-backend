const jwt = require("jsonwebtoken")
const loginAudience = "session"

function createSessionJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
        audience: loginAudience
    })
}

module.exports = { createSessionJWT }

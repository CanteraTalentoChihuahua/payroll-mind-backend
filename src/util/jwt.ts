import jwt from "jsonwebtoken";
const loginAudience = "session";

function createSessionJWT(payload: object) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h",
        audience: loginAudience
    });
}

function verifySessionJWT(token: string) {
    try {
        return {
            isValid: true, payload: jwt.verify(token, process.env.JWT_SECRET!, {
                audience: loginAudience,
                algorithms: ["HS256"]
            })
        };
    } catch {
        return { isValid: false, payload: undefined };
    }
}

export default { createSessionJWT, verifySessionJWT };

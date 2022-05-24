const users = require("../database/models/users");
const jwt = require("../util/jwt");

async function logIn(email, password) {
    const userData = await users.findAll({
        arguments: ["id", "password", "role"],
        where: {email}
    });

    if (userData["password"] !== password) {
        return {loggedIn: false, token: null};
    }

    const token = jwt.createSessionJWT({
        id: userData["id"],
        role: userData["role"]
    });

    return {loggedIn: Boolean(token), token };
}

module.exports = {logIn};

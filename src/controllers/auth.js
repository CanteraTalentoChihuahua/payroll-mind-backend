const users = require("../database/models/users");
const jwt = require("../util/jwt");

async function logIn(email, password) {
    const userData = await users.findOne({
        where: {email}
    });

    if (userData === null || userData.password !== password) {
        return {loggedIn: false, token: null};
    }

    const token = jwt.createSessionJWT({
        id: userData.id,
        role: userData.role
    });

    return {loggedIn: Boolean(token), token };
}

module.exports = {logIn};
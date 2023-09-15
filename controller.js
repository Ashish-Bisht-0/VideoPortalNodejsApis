const bcrypt = require("bcrypt");
const loginModel = require("./database/models/loginModel");
const allowed_services = require("./user_services")


async function login(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res
            .status(401)
            .json({ message: "Authorization header missing or invalid" });
        return;
    }

    const credentials = authHeader.slice(6);
    const decodedCredentials = Buffer.from(credentials, "base64").toString();
    const [username, password] = decodedCredentials.split(":");

    try {
        const user = await  loginModel.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        req.session.userId = username;
        req.session.role = user.role;
        console.log("\nSuccess Authorization.....");
        // console.log(req.session);
        res.status(200).json({ user: username, role: user.role, login: "authorized" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function logout(req, res) {
    if (req.session) {
        req.session.destroy();
        return res.status(200).json("LoggedOut");
    }
    else {
        return res.status(401).json("Notauthorized");
    }
}

async function getHomePage(req, res) {
    return res.status(200).json("home");
}

async function getMainPage(req, res) {
    const role = req.session.role;
    const user = req.session.userId;

    return res.status(200).json({ user, role, services:allowed_services[role]});
}


module.exports = {
    login,
    logout,
    getHomePage,
    getMainPage,
};

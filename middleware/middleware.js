async function isLoggedIn (req, res, next) {
    try {
        if (req.session && req.session.userId) {
            next();
        } else {
            res.status(401).json("Unauthorized");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }

}

module.exports = {isLoggedIn}
//for importing use
//  const {isLoggedIn} = require("./middleware.js")
//  if module.exports = isLoggedIn
//  then use
//  const isLoggedIn = require("./middleware.js")
//
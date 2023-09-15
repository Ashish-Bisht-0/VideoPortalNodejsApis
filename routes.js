const express = require("express");
const router = express.Router();
const {login,logout,getHomePage,getMainPage} = require("./controller");
const {isLoggedIn} = require("./middleware/middleware")
const {getContentProperties,createContentProperties,updateContentProperties} = require("./services/contentProperties")


// Define routes
router.get("/home",isLoggedIn, getHomePage);
router.post("/login", login);
router.get("/mainPage", isLoggedIn, getMainPage);

router.get("/contentProperties/:id", isLoggedIn, getContentProperties);
router.post("/contentProperties", isLoggedIn, createContentProperties);
router.put("/contentProperties", isLoggedIn, updateContentProperties);

router.delete("/logout", isLoggedIn, logout);

module.exports = router;

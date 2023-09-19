const mongoose = require("mongoose");
const {db_connection} = require("../database");

const login_schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

const loginModel = db_connection.model("login_collection", login_schema);


module.exports=loginModel;

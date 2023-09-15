const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const routes = require("./routes");
const {db_connection} = require("./database/database");  //As soon as server starts connect to the data base
const {sessionSecretKey,mongo_uri} = require("./config/config");

const app = express();
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST","GET","PUT","DELETE"],
    credentials:true
}));

const sessionStore = new mongoDbSession({
    uri:mongo_uri,
    collection: "LoginSessions",
})

app.use(express.json());

app.use(session({
    name: "video-portal-cookie",
    secret:   sessionSecretKey,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false, //if true then only transfer cookie over https
        httpOnly: true,
        maxAge: 1000 * 60 * 30 //30 min max cookie time
    }
}));

// Use routes defined in a separate module
app.use("/", routes);

// Start the Express application
db_connection.once("open", () => {
    console.log("\nConnected to MongoDB");
    // Start the server only when the database connection is ready
    app.listen(5000, () => console.log("\nServer started on port 5000"));
  });

db_connection.on("error", (err) => {
    console.error("\nError connecting to MongoDB:", err);
});
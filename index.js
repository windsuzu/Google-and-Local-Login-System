const express = require("express");
const favicon = require("serve-favicon");
var path = require("path");
const mongoose = require("mongoose");
const app = express();
const CookieSession = require("cookie-session");
const AuthRoute = require("./routes/auth-route");
const ProfileRoute = require("./routes/profile-route");
const passport = require("passport");
require("dotenv").config();
require("./configs/passport");

mongoose
    .connect(process.env.MONGO_ATLAS_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connect to MongoDB Atlas"))
    .catch((err) => console.log(err));

// middleware
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "images", "logo.png")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieSession({ keys: [process.env.COOKIE_SECRET] }));
app.use(passport.initialize());
app.use(passport.session());

// routing
app.use("/auth", AuthRoute);
app.use("/profile", ProfileRoute);

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

app.listen(8080);

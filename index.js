const express = require("express");
const favicon = require("serve-favicon");
var path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
dotenv.config();

// middleware
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "images", "logo.png")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(8080);

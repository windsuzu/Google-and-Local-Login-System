const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

/**
 * ===========================
 * Page Rendering
 * ===========================
 */
router.get("/check", (req, res) => {
    if (req.user) res.redirect("/profile");
    else res.redirect("login");
});

router.get("/login", (req, res) => {
    res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
    res.render("signup", { user: req.user });
});

/**
 * ===========================
 * Functions
 * ===========================
 */

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

/**
 * ===========================
 * Google
 * ===========================
 */

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

// The url ("/google/redirect") needs to be the same as in GoogleStrategy
router.get("/google/redirect", passport.authenticate("google"), (req, res) =>
    res.redirect("/profile")
);

/**
 * ===========================
 * Local
 * ===========================
 */

router.post("/signup", async (req, res) => {
    let { name, email, password } = req.body;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        req.flash("error_msg", "This email has been registered.");
        return res.redirect("signup");
    }

    password = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password });
    newUser
        .save()
        .then((savedUser) => {
            req.flash(
                "success_msg",
                "Registration succeeds! You can now login!"
            );
            return res.redirect("login");
        })
        .catch((err) => {
            req.flash("error_msg", err.errors.name.properties.message);
            return res.redirect("signup");
        });
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "login",
        failureFlash: "The email or password is incorrect.",
    }),
    (req, res) => res.redirect("/profile")
);

module.exports = router;

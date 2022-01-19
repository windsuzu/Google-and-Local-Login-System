const router = require("express").Router();
const passport = require("passport");

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

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

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

module.exports = router;

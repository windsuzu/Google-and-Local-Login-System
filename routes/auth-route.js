const router = require("express").Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    // req.logOut();
    res.render("signup");
});

router.get("/logout", (req, res) => {
    // req.logOut();
    res.redirect("/");
});

module.exports = router;

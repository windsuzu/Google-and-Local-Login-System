const router = require("express").Router();

// Middleware checks if the user is logged in
const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect("/auth/login");
    else next();
};

// 1. Put the middleware in the second parameter
// 2. Benefit from Session authentication, we can get user data from req.user
router.get("/", authCheck, (req, res) => {
    res.render("profile", { user: req.user });
});

router.get("/post", authCheck, (req, res) => {
    res.render("post", { user: req.user });
});

module.exports = router;

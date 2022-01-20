const router = require("express").Router();
const Post = require("../models/post-model");

// Middleware checks if the user is logged in
const authCheck = (req, res, next) => {
    req.session.returnUrl = req.originalUrl;
    if (!req.isAuthenticated()) res.redirect("/auth/login");
    else next();
};

// 1. Put the middleware in the second parameter
// 2. Benefit from Session authentication, we can get user data from req.user
router.get("/", authCheck, async (req, res) => {
    const posts = await Post.find({ author: req.user._id });
    res.render("profile", { user: req.user, posts });
});

router.get("/post", authCheck, (req, res) => {
    res.render("post", { user: req.user });
});

router.post("/post", authCheck, (req, res) => {
    let { title, content } = req.body;
    new Post({ title, content, author: req.user._id })
        .save()
        .then((post) => res.redirect("/profile"))
        .catch((err) => {
            req.flash("error_msg", "Failed to add post");
            return res.redirect("post");
        });
});

module.exports = router;

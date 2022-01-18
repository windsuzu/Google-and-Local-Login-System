const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("profile");
});

router.get("/post", (req, res) => {
    res.render("post");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const User = require("../models/User");

router.get("/register", async (req, res) => {
  res.render("user/register");
});
router.post("/register", async (req, res) => {

    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password); //hash add salt and store
    req.flash("succes", "welcome to yelp camp!");
    res.redirect("/campground");

});

module.exports = router;

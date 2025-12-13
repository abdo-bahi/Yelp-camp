const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const User = require("../models/User");
const passport = require("passport");

router.get("/register", async (req, res) => {
  res.render("user/register");
});
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password); //hash add salt and store
    req.flash("success", "New user registered successfuly");
    res.redirect("/campground");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});
router.get("/login", (req, res) => {
  res.render("user/login");
});
//options are local, google ...
router.post(
  "/login",
  // passport.authenticate("local", {
  //   failureRedirect: "/login",
  //   failureFlash: true
  // }),
  (req, res) => {
    req.flash("success", "login success!");
    res.redirect("/campground");
  }
);

module.exports = router;

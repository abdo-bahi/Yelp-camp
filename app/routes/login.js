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

    req.login(registeredUser, function(err) {
      if (err) { 
        req.flash('error', 'can\'t log you In !');
        return next(err); }
        req.flash("success", "New user registered successfuly");
        res.redirect("/campground");
    });
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
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "login success!");
    // redirect to previous url then delete it (ux experience)
    const redirectUrl = req.session.redirectUrl || '/campground';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  }
);
router.get('/logout',(req, res) => {
  //logout with express after passing a callback function
  req.logout(function(err) {
    if (err) { 
      req.flash('error', 'can\'t log you out !');
      return next(err); }
    req.flash('success', 'loged you out see you back !');
    res.redirect('/');
  });
});

module.exports = router;

const User = require("../models/User");
const passport = require("passport");

module.exports.registerForm = async (req, res) => {
    res.render("user/register");
  }

module.exports.register =  async (req, res) => {
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
  }

module.exports.loginForm = (req, res) => {
    res.render("user/login");
  }

module.exports.loginPassport = 
passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
})
module.exports.loginAction = 
(req, res) => {
  req.flash("success", "login success!");
  // redirect to previous url then delete it (ux experience)
  const redirectUrl = req.session.redirectUrl || '/campground';
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
}
module.exports.logout = 
(req, res) => {
    //logout with express after passing a callback function
    req.logout(function(err) {
      if (err) { 
        req.flash('error', 'can\'t log you out !');
        return next(err); }
      req.flash('success', 'loged you out see you back !');
      res.redirect('/');
    });
  }

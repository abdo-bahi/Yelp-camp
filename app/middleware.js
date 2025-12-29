const CampGround = require("./models/CampGround");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // storing current url to come back to after re login
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be signed in !");
    return res.redirect("/login");
  }
  next();
};

module.exports.isCampAuthor = async (req, res, next) => {
  const camp = await CampGround.findById(req.params.id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that !");
    return res.redirect(`/campground/${camp.id}`);
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) =>  {
    if(!req.isAuthenticated()){
        // storing current url to come back to after re login 
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'you must be signed in !');
        return res.redirect('/login');
      }
      next();
  }

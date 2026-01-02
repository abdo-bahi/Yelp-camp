const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const User = require("../models/User");
const passport = require("passport");
const userController = require("../controllers/userController");

router.route("/register")
  .get(userController.registerForm)
  .post(userController.register);

router.route("/login")
  .get(userController.loginForm)
  .post(userController.loginPassport, userController.loginAction);

  router.get('/logout', userController.logout);

module.exports = router;

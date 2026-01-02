const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const User = require("../models/User");
const passport = require("passport");
const userController = require("../controllers/userController");

router.get("/register", userController.registerForm);
router.post("/register", userController.register);
router.get("/login", userController.loginForm);
//options are local, google ...
router.post("/login",  userController.loginPassport, userController.loginAction);
router.get('/logout', userController.logout);

module.exports = router;

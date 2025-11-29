const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");

router.post('/login', async(req, res) => {
    const {email, password} = req.body;

});
router.post('/register', async(req, res) => {
    const {email, password} = req.body;

});
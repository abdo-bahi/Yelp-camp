const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");


router.get('/register', async(req, res) => {
    res.render('user/register')

});
router.post('/register', async(req, res) => {
    res.send(req.body);

});

module.exports = router;
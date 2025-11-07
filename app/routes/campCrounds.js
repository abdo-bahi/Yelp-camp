const express = require('express');
const { model } = require('mongoose');
const CampGround = require('../models/CampGround');
const router = express.Router();

// adding the cookies parser to work with cookier 


//we can add a router middelware to these routes as in : 
// router.use((req, res, next) => {
//     if(req.query.isAdmin){
//         next();
//     }
//     res.send('sorry , not an admin');
// });
router.get('/', async(req, res) => {
    const camps = await CampGround.find({});
    //sending a web cookie to be stored in the client's browser cookies
    res.cookie('name', 'Abderrahmane', {signed:true});
    //const {name = 'visitor'} = req.cookies;
       //signined true wile passing a secret key while using cookieParser gives us the ability to check if it was the valide (not 'false' value) sent before cookie
    const {name = 'visitor'} = req.signedCookies;
    res.render("campgrounds/index", { camps, name });
});

module.exports = router;

//*******important
// signing cookies isnt about making them a secret it's about 
//ensuring they are the same cookies sent to us in the first place
//*/
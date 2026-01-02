const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn, isCampAuthor} = require("../middleware")
const campGroundController = require("../controllers/campgroundController");
// adding the cookies parser to work with cookier

//we can add a router middelware to these routes as in :
// router.use((req, res, next) => {
//     if(req.query.isAdmin){
//         next();
//     }
//     res.send('sorry , not an admin');
// });
router.get("/", isLoggedIn, campGroundController.index);
// flash is a way to show an information one time like after creating an object indicating that it was succesfully created

router.post("/", isLoggedIn, campGroundController.saveNew);

router.get("/new", isLoggedIn, campGroundController.addForm);
router.get("/:id", isLoggedIn, campGroundController.getById);

router.get("/:id/edit", isLoggedIn, isCampAuthor, campGroundController.editForm);
router.patch("/:id", isLoggedIn, isCampAuthor, campGroundController.edit);
router.delete("/:id", isLoggedIn, isCampAuthor, campGroundController.delete);
//*******important
// signing cookies isnt about making them a secret it's about
//ensuring they are the same cookies sent to us in the first place
//*/
module.exports = router;

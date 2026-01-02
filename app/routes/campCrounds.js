const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isCampAuthor } = require("../middleware");
const campGroundController = require("../controllers/campgroundController");
// adding the cookies parser to work with cookier

//we can add a router middelware to these routes as in :
// router.use((req, res, next) => {
//     if(req.query.isAdmin){
//         next();
//     }
//     res.send('sorry , not an admin');
// });
// flash is a way to show an information one time like after creating an object indicating that it was succesfully created

//here we are chaining routes with the same url but defferent request types
router
  .route("/")
  .get(isLoggedIn, campGroundController.index)
  .post(isLoggedIn, campGroundController.saveNew);
  
router.get("/new", isLoggedIn, campGroundController.addForm);

router
  .route("/:id")
  .get(isLoggedIn, campGroundController.getById)
  .patch(isLoggedIn, isCampAuthor, campGroundController.edit)
  .delete(isLoggedIn, isCampAuthor, campGroundController.delete);

router.get(
  "/:id/edit",
  isLoggedIn,
  isCampAuthor,
  campGroundController.editForm
);
//*******important
// signing cookies isnt about making them a secret it's about
//ensuring they are the same cookies sent to us in the first place
//*/
module.exports = router;

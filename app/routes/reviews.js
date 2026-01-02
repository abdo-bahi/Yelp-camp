const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError");
const {validateReview} = require("../middleware");
const {isLoggedIn, isReviewAuthor} = require("../middleware")
const reviewController = require("../controllers/reviewController");
const Review = require("../models/Review");
const { reviewSchema } = require("../schemas");

//the validateReview from above will check before passing
//validating the review model before saving it


router.post("/", validateReview, isLoggedIn, reviewController.saveReview);
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;
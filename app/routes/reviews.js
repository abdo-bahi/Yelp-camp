const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError");
const {validateReview} = require("../middleware");
const {isLoggedIn} = require("../middleware")

const Review = require("../models/Review");
const { reviewSchema } = require("../schemas");

//the validateReview from above will check before passing
//validating the review model before saving it


router.post("/", validateReview, isLoggedIn, async (req, res) => {
  const camp = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  camp.reviews.push(review);
  await camp.save();
  req.flash("success", "Successfully added review !");
  res.redirect(`/campground/${camp.id}`);
});
router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  if (!(id && reviewId)) {
    throw new ExpressError(error.details.message, 400);
  } else {
    //this pull takes an object matching from the array within the db
    await CampGround.findByIdAndUpdate(id, { $pull: { reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review !");
    res.redirect(`/campground/${id}`);
  }
});

module.exports = router;
const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError");


const Review = require("../models/Review");
const { reviewSchema } = require("../schemas");

//the validateReview from above will check before passing
//validating the review model before saving it
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details.message, 400);
    } else {
      next();
    }
  };

router.post("/", validateReview, async (req, res) => {
  const camp = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  await review.save();
  camp.reviews.push(review);
  await camp.save();
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
    res.redirect(`/campground/${id}`);
  }
});

module.exports = router;
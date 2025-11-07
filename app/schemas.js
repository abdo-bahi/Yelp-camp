const Joi = require("joi");
//used for middelware validating objects
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});

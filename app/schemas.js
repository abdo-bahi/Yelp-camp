const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

// here we are using extention with joi to escape 
//cross site scripting we couldve used npm validate html but we are using joi for now

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags : [],
          allowedAttributes: {},
        });
        //checking if something was removed (not allowed) to return 'not allowed'
        if(clean !== value) return helpers.error('string.escapeHTML', {value})
          return clean;
      }
    }
  }
});
//adding the extention to joi to be able to chain it in validation below
const Joi= BaseJoi.extend(extension);


//used for middelware validating objects
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    //adding the html safe check check
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});

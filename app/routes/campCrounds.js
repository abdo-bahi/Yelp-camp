const express = require("express");
const { model } = require("mongoose");
const CampGround = require("../models/CampGround");
const router = express.Router();




// this middleware to add a variable that is accessible through all tamplates  ( better use of flashes)
router.use((req, res, next) => {
    res.locals.message = req.flash('success');
    next();
});

// adding the cookies parser to work with cookier

//we can add a router middelware to these routes as in :
// router.use((req, res, next) => {
//     if(req.query.isAdmin){
//         next();
//     }
//     res.send('sorry , not an admin');
// });
router.get("/", async (req, res) => {
  const camps = await CampGround.find({});
  //sending a web cookie to be stored in the client's browser cookies
  res.cookie("name", "Abderrahmane", { signed: true });
  //const {name = 'visitor'} = req.cookies;
  //signined true wile passing a secret key while using cookieParser gives us the ability to check if it was the valide (not 'false' value) sent before cookie
  const { name = "visitor" } = req.signedCookies;

  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  const sessionCount = req.session.count;
  res.render("campgrounds/index", {
    camps,
    name,
    sessionCount,
  });
});
// flash is a way to show an information one time like after creating an object indicating that it was succesfully created

module.exports = router;
router.post("/", async (req, res, next) => {
  if (!req.body) {
    throw new ExpressError("Invalide Attributes", 422);
  }
  const { title, location, image, price, description } = req.body;
  if (!(title && location && image && price && description)) {
    throw new ExpressError("Invalide Attributes", 422);
  }
  console.log(`title : ${title}\nloacation:${location}`);
  const camp = new CampGround({
    title: title,
    location: location,
    image: image,
    price: price,
    description: description,
  });
  await camp.save();
  //   creating the flash entity
  req.flash("success", "Successfully made a camp Ground !");
  res.redirect(`/campground/${camp._id}`);
});

router.get("/new", async (req, res) => {
    res.render("campgrounds/new");
  });
router.get("/:id", async (req, res) => {
  const camp = await CampGround.findById(req.params.id).populate("reviews");
  res.render("campgrounds/show", { camp, message: req.flash("success") });
});

//*******important
// signing cookies isnt about making them a secret it's about
//ensuring they are the same cookies sent to us in the first place
//*/

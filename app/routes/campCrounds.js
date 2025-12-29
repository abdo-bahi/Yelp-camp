const express = require("express");
const CampGround = require("../models/CampGround");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn, isCampAuthor} = require("../middleware")
// adding the cookies parser to work with cookier

//we can add a router middelware to these routes as in :
// router.use((req, res, next) => {
//     if(req.query.isAdmin){
//         next();
//     }
//     res.send('sorry , not an admin');
// });
router.get("/", isLoggedIn, async (req, res) => {
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

router.post("/", isLoggedIn, async (req, res, next) => {
  if (!req.body) {
    throw new ExpressError("Invalide Attributes", 422);
  }
  const { title, location, image, price, description } = req.body;
  if (!(title && location && image && price && description)) {
    throw new ExpressError("Invalide Attributes", 422);
  }
  const camp = new CampGround({
    title: title,
    location: location,
    image: image,
    price: price,
    description: description,
  });
  camp.author = req.user._id;
  await camp.save();
  //   creating the flash entity
  req.flash("success", "Successfully made a camp Ground !");
  res.redirect(`/campground/${camp._id}`);
});

router.get("/new", isLoggedIn, async (req, res) => {
  if(!req.isAuthenticated()){
    req.flash('error', 'you must be signed in !');
    return res.redirect('/login');
  }
  res.render("campgrounds/new");
});
router.get("/:id", isLoggedIn, async (req, res) => {
  const camp = await CampGround.findById(req.params.id).populate("reviews").populate("author");
  console.log('camp : ', camp );
  if (!camp) {
    req.flash("error", "cannot find that campground!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/show", { camp });
});

router.get("/:id/edit", isLoggedIn, isCampAuthor, async (req, res) => {
  const camp = await CampGround.findById(req.params.id);
  if (!camp) {
    req.flash("error", "cannot find that campground!");
    return res.redirect("/campground");
  }
  if(! camp.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that !');
    return res.redirect(`/campground/${camp.id}`);
  }
  res.render("campgrounds/edit", { camp });
});
router.patch("/:id", isLoggedIn, isCampAuthor, async (req, res) => {
  // const { title, location, image, description } = req.body;
  const camp = await CampGround.findById(req.params.id);
  camp.set(req.body);
  await camp.save();
  req.flash("success", "Successfully updated camp Ground !");
  res.redirect(`/campground/${camp.id}`);
});
router.delete("/:id", isLoggedIn, isCampAuthor,  async (req, res) => {
  await CampGround.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted CampGround !");
  res.redirect(`/campground`);
});
//*******important
// signing cookies isnt about making them a secret it's about
//ensuring they are the same cookies sent to us in the first place
//*/
module.exports = router;

const { cloudinary } = require("../cloudinary");
const CampGround = require("../models/CampGround");

module.exports.index = async (req, res) => {
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
};
module.exports.saveNew = async (req, res, next) => {
  if (!req.body) {
    throw new ExpressError("Invalide Attributes", 422);
  }
  const { title, location, price, description } = req.body;
  if (!(title && location && price && description)) {
    throw new ExpressError("Invalide Attributes", 422);
  }
  const camp = new CampGround({
    title: title,
    location: location,
    price: price,
    description: description,
  });
  camp.images = req.files.map(f => ({url : f.path, filename:f.filename}));
  camp.author = req.user._id;
  await camp.save();
  //   creating the flash entity
  req.flash("success", "Successfully made a camp Ground !");
  res.redirect(`/campground/${camp._id}`);
};
module.exports.addForm = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signed in !");
    return res.redirect("/login");
  }
  res.render("campgrounds/new");
};
module.exports.getById = async (req, res) => {
  //heres is the 'nested' populate where we must populate reviewsIds to reveiws and thier author for each review
  const camp = await CampGround.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");

  console.log("camp : ", camp);
  if (!camp) {
    req.flash("error", "cannot find that campground!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/show", { camp });
};

module.exports.editForm = async (req, res) => {
  const camp = await CampGround.findById(req.params.id);
  if (!camp) {
    req.flash("error", "cannot find that campground!");
    return res.redirect("/campground");
  }
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that !");
    return res.redirect(`/campground/${camp.id}`);
  }
  res.render("campgrounds/edit", { camp });
};
module.exports.edit = async (req, res) => {
  // const { title, location, image, description } = req.body;
  const camp = await CampGround.findById(req.params.id);
  camp.set(req.body);
  const imgs = req.files.map(f => ({url : f.path, filename:f.filename}));
  //here we spread the array into multiple objects for node to accepte it ( we mustnt send an entire array)
  camp.images.push(...imgs);
  await camp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({$pull: {images:{filename:{$in: req.body.deleteImages}}}});
  }
  console.log("here/////", req.body.deleteImages);
  req.flash("success", "Successfully updated camp Ground !");
  res.redirect(`/campground/${camp.id}`);
};

module.exports.delete = async (req, res) => {
  await CampGround.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted CampGround !");
  res.redirect(`/campground`);
};

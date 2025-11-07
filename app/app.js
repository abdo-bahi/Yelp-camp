const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const CampGround = require("./models/CampGround");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/Review");
const { reviewSchema } = require("./schemas");
const campgroundRoutes = require("./routes/campCrounds");

// adding the cookies parser to work with cookier
const cookieParser = require("cookie-parser");
//app.us the cookieParser while executing it
app.use(cookieParser("thisIsMySecret"));

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("DataBase Connected");
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// all requests will trigger this one
// app.use(() => {
//   console.log('this is a req midelware')
// });
// this logs incoming request things
app.use(morgan("tiny"));
app.use((req, res, next) => {
  console.log("--- DEBUG MIDDLEWARE ---");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  next();
});
//validating the review model before saving it
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.message, 400);
  } else {
    next();
  }
};

// midelware chaining we'll have this is 1st then this is 2nd then ****
// but the chaining will be broken once a express.response is sent from one midellware
// the triggering the path / called

// app.use((req, res, next) => {
//   // this ensures that no matter what request we get ( post , path ...) it will transform it to a get req
//   req.method = 'GET';
//   console.log('this is the 1st req midelware');
//   next();
// })
// ;
// app.use((req, res, next) => {
//   console.log('this is the 2nd req midelware');
//   next();
// });
app.get("/", (req, res) => {
  res.render("index");
});
//replacing the below route with a route created in ./routes/campgrounds.js
app.use("/campground", campgroundRoutes);
// app.get("/campground", async (req, res) => {
//   const camps = await CampGround.find({});
//   res.render("campgrounds/index", { camps });
// });

app.get("/campground/new", async (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campground",
  catchAsync(async (req, res, next) => {
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
    res.redirect(`/campground/${camp._id}`);
  })
);

app.get("/campground/:id", async (req, res) => {
  const camp = await CampGround.findById(req.params.id).populate("reviews");
  res.render("campgrounds/show", { camp });
});
app.get("/campground/:id/edit", async (req, res) => {
  const camp = await CampGround.findById(req.params.id);
  res.render("campgrounds/edit", { camp });
});
app.patch("/campground/:id", async (req, res) => {
  // const { title, location, image, description } = req.body;
  const camp = await CampGround.findById(req.params.id);
  camp.set(req.body);
  await camp.save();
  res.redirect(`/campground/${camp.id}`);
});
app.delete("/campground/:id", async (req, res) => {
  await CampGround.findByIdAndDelete(req.params.id);
  res.redirect(`/campground`);
});
//the validateReview from above will check before passing
app.post("/campground/:id/reviews", validateReview, async (req, res) => {
  const camp = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  await review.save();
  camp.reviews.push(review);
  await camp.save();
  res.redirect(`/campground/${camp.id}`);
});
app.delete("/campground/:id/reviews/:reviewId", async (req, res) => {
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
//the last next will be used as a 404 wrong path status
// we dont have to add a midelware with next before it
app.all("/{*any}", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("Not Working !!");
  const { statusCode = 599, message = "Something went wrong!" } = err;
  console.log(`status : ${statusCode} \nmessage: ${message}`);
  res.status(statusCode).render("error", { err });
  //res.send("404 not found")
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
//const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const campgroundRoutes = require("./routes/campCrounds");
const reviewRoutes = require("./routes/reviews");
//add assets directory here :
app.use(express.static(path.join(__dirname, "public")));
// adding the cookies parser to work with cookier
const cookieParser = require("cookie-parser");
//app.us the cookieParser while executing it
app.use(cookieParser("thisIsMySecret"));

//sessions work these are variables corresponding the client strored ( in this case ) on the ''temp memory''
//where in the client he will only save his sessionID in (connect.sid) variable
const session = require("express-session");
//resave is to force resaving the sessions variables
//saveUninitialized is to force resaving the sessions variables

// flash is a way to show an information one time like after creating an object indicating that it was succesfully created
const flash = require("connect-flash");
app.use(flash());

const confSession = {
  secret: "thisIsAWeakSecret",
  resave: false,
  saveUninitialized: true,
  // store property should be added to store in Db but not neccessery for dev
  cookie: {
    httpOnly: true, //this additional security feature where only valde sourced cookies are accepted
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //for a week (in ms)
    maxAge: 1000 * 60 * 60 * 60 * 24 * 7,
  }
};
app.use(session(confSession));
// this middleware to add a variable that is accessible through all tamplates  ( better use of flashes)
app.use((req, res, next) => {
  // <%=message%> will be accesible now from any ejs temlplate
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
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
app.use("/campground/:id/reviews", reviewRoutes);
// app.get("/campground", async (req, res) => {
//   const camps = await CampGround.find({});
//   res.render("campgrounds/index", { camps });
// });

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

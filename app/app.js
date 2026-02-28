if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
//const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/User");
const dbUrl = process.env.DB_URL;

//this helmet is a headers protection middleware( more security mesures)
const helmet = require('helmet');
const mongoSanitize =  require("express-mongo-sanitize");
//add assets directory here :
app.use(express.static(path.join(__dirname, "public")));
const campgroundRoutes = require("./routes/campCrounds");
const reviewRoutes = require("./routes/reviews");
const loginRoutes = require("./routes/login");

// adding the cookies parser to work with cookier
const cookieParser = require("cookie-parser");
//app.us the cookieParser while executing it
const passport = require("passport");
const localStrategy = require("passport-local");
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
  name:'campSession',
  secret: "thisIsAWeakSecret",
  resave: false,
  saveUninitialized: false,
  // store property should be added to store in Db but not neccessery for dev
  cookie: {
    httpOnly: true, //this additional security feature where only valde sourced cookies are accepted
    // secure: true, this obligates coming reqs to be in https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //for a week (in ms)
    maxAge: 1000 * 60 * 60 * 60 * 24 * 7,
  },
};
app.use(session(confSession));
// this middleware to add a variable that is accessible through all tamplates  ( better use of flashes)

//beneath Session
//setting passport auth and sessions hundling

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

//serialisation how to store user in a session
passport.serializeUser(User.serializeUser());
//deserialisation how to unstore user from session
passport.deserializeUser(User.deserializeUser());
//
mongoose.connect(dbUrl)
.then(() => {
  console.log("MongoDB connected");
})
.catch(err => {
  console.log("connection error:", err);
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
//helmet setting with all 11 headers protector middleware while desabling

app.use(helmet());
// here we are setting helmlet content security policy 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://stackpath.bootstrapcdn.com"
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://fonts.googleapis.com",
        "https://stackpath.bootstrapcdn.com"
      ],

      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://tile.openstreetmap.org",
        "https://*.tile.openstreetmap.org",
        "https://res.cloudinary.com",
        "https://images.unsplash.com",
        "https://unpkg.com",
        "https://stackpath.bootstrapcdn.com"
      ],

      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://stackpath.bootstrapcdn.com"
      ],

      connectSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],

      objectSrc: [],
    },
  })
);

// all requests will trigger this one
// app.use(() => {
//   console.log('this is a req midelware')
// });
// this logs incoming request things
app.use((req, res, next) => {
  // <%=message%> will be accesible now from any ejs temlplate
  //this passes the current user to the ejs access
  console.log('req.user : ', req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use(morgan("tiny"));
app.use((req, res, next) => {
  console.log("--- DEBUG MIDDLEWARE ---");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  next();
});
//****************  mongo injection ************ */

//this package prohibite special 
//chars that are used in querying or manipulating inside the app as preventing mongo injection by ignoring input data containging special mongo query chars

// app.use(mongoSanitize());

//****************  mongo injection ************ */

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
app.use("/", loginRoutes);
// app.get("/campground", async (req, res) => {
//   const camps = await CampGround.find({});
//   res.render("campgrounds/index", { camps });
// });
// app.get('/login', async(req, res) => {
//   //const {email, password} = req.body;
//   const user = new User({email: 'test@ioseeds.dz', username: 'abderrahamne'});
//   const newUser = await User.register(user, 'test@');
//   res.send(newUser);
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

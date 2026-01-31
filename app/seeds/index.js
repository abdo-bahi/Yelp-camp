const mongoose = require("mongoose");
const CampGround = require("../models/CampGround");
const cities = require("./cities");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("DataBase Connected");
});
const images = ["https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ,"https://images.unsplash.com/photo-1631635589499-afd87d52bf64?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ,"https://images.unsplash.com/photo-1571687949921-1306bfb24b72?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]
const type = [
  "Montaines",
  "Woods",
  "Plains",
]
const seedDB = async () => {
  await CampGround.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(Math.random() * 1000);
    const camp = new CampGround({
      location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dc6n1s8h4/image/upload/v1769858549/YelpCamp/kaxn3cotrhnq9y3e4xrf.jpg',
          filename: 'YelpCamp/kaxn3cotrhnq9y3e4xrf',
        }
      ]
      , author: '693dbdeb3fffc0a69dfbad75'
      , title: `The ${cities[randomNum].state}'s ${type[randomNum%3]}`
    });
    await camp.save();
  }
};

seedDB();
console.log("operation Finished");
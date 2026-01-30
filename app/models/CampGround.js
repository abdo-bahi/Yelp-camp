const mongoose = require("mongoose");
const Review = require("./Review");
const Schema = mongoose.Schema;

const CampGoundSchema = new Schema({
  title: String,
  images: [{
    url: String,
    filename: String
  }],
  price: Number,
  description: String,
  location: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampGoundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      // eq to sql in (values..) query 
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model("CampGround", CampGoundSchema);

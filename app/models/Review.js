const mongoose = require('mongoose');
const CampGround = require('./CampGround');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        body: String,
        rating: Number,
    }
);



module.exports = mongoose.model('Review', reviewSchema);
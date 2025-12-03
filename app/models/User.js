const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//trying to get the function and not the object from passportLocalMongoose
const passportLocalMongoose = require('passport-local-mongoose').default ||
require('passport-local-mongoose');
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // This ensures the username is unique across all users
  }
//   password: {
//     type: String,
//     required: true
//   }
});
//This is going to make the userName and password fields with unique validators ...
//and add some static methodes like authenticate() , serialize() and deserialize()
console.log(passportLocalMongoose);
UserSchema.plugin(passportLocalMongoose);
console.log(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

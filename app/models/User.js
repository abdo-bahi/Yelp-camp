const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // This ensures the username is unique across all users
  },
//   password: {
//     type: String,
//     required: true
//   }
});
//This is going to make the userName and password fields with unique validators ...
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);

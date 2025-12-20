const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//trying to get the function and not the object from passportLocalMongoose with .default after (V8+) see:
//https://stackoverflow.com/questions/79837236/error-in-plugin-passport-local-mongoose-schema-plugin-should-be-function-not-a
const passportLocalMongoose = require('passport-local-mongoose')
.default ||
require('passport-local-mongoose')
;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    //unique: true // This ensures the email is unique across all users
  }
//   password: {
//     type: String,
//     required: true
//   }
});
//This is going to make the userName and password fields with unique validators ...
//and add some static methodes like authenticate() , serialize() and deserialize()
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);
// passportLocalMongoose --> this will automatically implement username, salting & hashing, hashed and salted password

module.exports = mongoose.model("User", userSchema);

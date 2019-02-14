const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator"); //use as a plugins having extra functionality on schema

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  username: {type: String, required: true},
  imagePath: { type: String},
  department: {type: String, required: true},
  registrationno: {type: String, required: true, unique: true},
  likes: {type: Array},
  dislikes: {type: Array},
  commentson: {type: Array},
  archives: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
  eventsjoined: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  groupsjoined: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);//collection will be User

const mongoose = require('mongoose');


const reportSchema = mongoose.Schema({
 title: { type: String, required: true},
  content: { type: String, required: true},
  username: { type: String},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
 postid: {type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true},
  reportedby: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  reason: {type: String}
});

module.exports = mongoose.model('Report', reportSchema);//collection will be posts

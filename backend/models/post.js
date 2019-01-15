const mongoose = require('mongoose');

// Validate Function to check comment length
let commentLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return comment as valid
    }
  }
};

// Array of Comment validators
const commentValidators = [
  // First comment validator
  {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters.'
  }
];

const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  imagePath: { type: String},
  username: { type: String},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  createdAt: {type: Date, default: Date.now()},
  likes: {type: Number, default: 0},
  likedBy: {type: Array},
  dislikes: {type: Number, default: 0},
  dislikedBy: {type: Array},
  commentsNo: {type: Number,default:0},
  comments: [{
    comment:{type: String, validate: commentValidators},
    commentator: {type: String},
    commentatorid: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  }]
});

module.exports = mongoose.model('Post', postSchema);//collection will be posts

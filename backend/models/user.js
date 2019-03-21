const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator"); //use as a plugins having extra functionality on schema

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  username: {type: String, required: true},
   imagePath: { type: String, default: "http://localhost:3000/profileimgs/fa15-bcs-008@student.comsats.edu.pk-1550920240501.png"},
  // imagePath : { data: Buffer, contentType: String },
  department: {type: String, required: true},
  registrationno: {type: String, required: true, unique: true},
  likes: {type: Array},
  dislikes: {type: Array},
  commentson: {type: Array},
  archives: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
  eventsjoined: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  groupsjoined: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}],
  notifications: [
    {
      senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
      senderName: {type: String},
      senderimage: {type: String},
      message: {type: String},
      created: {type: Date, default: Date.now()}
    }
  ],
  chatList: [
    {
     receiverId:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      msgId:  {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
    }
  ]

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);//collection will be User

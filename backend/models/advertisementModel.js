const mongoose = require('mongoose');



const advertisementSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  imagePath: { type: String},
  approved: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now()},
  username: { type: String},
  adcreator: {type: mongoose.Schema.Types.ObjectId, ref: "Advertiser"},
  });

module.exports = mongoose.model('Advertisement', advertisementSchema);//collection will be posts

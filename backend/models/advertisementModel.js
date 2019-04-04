const mongoose = require('mongoose');



const advertisementSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  imagePath: { type: String},
  username: { type: String},
  adcreator: {type: mongoose.Schema.Types.ObjectId, ref: "Advertiser"},
  adcreatedAt: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('Advertisement', advertisementSchema);//collection will be posts

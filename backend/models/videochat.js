const mongoose = require('mongoose');


const videochatSchema = mongoose.Schema({
  tokenvideo: { type: String, required: true},
  snederid: {type: String},
  receiverid: {type: String}
});

module.exports = mongoose.model('VideoChat', videochatSchema);//collection will be posts

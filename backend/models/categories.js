const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
  cattitle: { type: String, required: true},
  postsids: [{type: String}],
  usersids: [{type: String}]
});

module.exports = mongoose.model('Category', categorySchema);//collection will be posts

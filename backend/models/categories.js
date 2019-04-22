const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
  cattitle: { type: String, required: true},
  postsids: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}]
});

module.exports = mongoose.model('Category', categorySchema);//collection will be posts

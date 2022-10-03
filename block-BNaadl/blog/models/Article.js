const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  author: String,
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Article", articleSchema);

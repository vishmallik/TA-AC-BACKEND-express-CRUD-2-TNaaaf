const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  summary: String,
  pages: { type: Number, default: 0 },
  publication: String,
  cover_image: String,
  category: [String],
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
});

module.exports = mongoose.model('Book', bookSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  summary: String,
  pages: { type: Number, default: 0 },
  publication: String,
  cover_image: String,
  category: [
    {
      type: String,
      enum: ['fiction', 'adventure', 'technology', 'motivation'],
    },
  ],
  author: {
    name: { type: String, required: true },
    email: String,
    country: String,
  },
});

module.exports = mongoose.model('Book', bookSchema);

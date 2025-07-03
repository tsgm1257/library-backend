const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  isbn: String,
  description: String,
  copies: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model('Book', bookSchema);

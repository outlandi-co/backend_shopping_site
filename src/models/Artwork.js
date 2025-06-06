
// models/Artwork.js
const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    filePath: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artwork', artworkSchema);
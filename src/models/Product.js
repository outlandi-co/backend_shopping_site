const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  colors: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

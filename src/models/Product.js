// ✅ models/Product.js (vendor removed)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  sku:         { type: String },
  description: { type: String },
  price:       { type: Number, required: true },
  image:       { type: String },
  category:    { type: String },
  quantity:    { type: Number, required: true },
  colors:      { type: [String], default: [] },
  sizes:       { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
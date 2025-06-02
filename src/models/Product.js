// ✅ models/Product.js (updated with cost, listPrice, and vendors)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor:      { type: String, required: true },
  vendors:     { type: [String], default: [] }, // additional vendor names
  name:        { type: String, required: true },
  sku:         { type: String },
  description: { type: String },
  cost:        { type: Number, required: true }, // wholesale cost
  listPrice:   { type: Number, required: true }, // customer-facing price
  image:       { type: String },
  category:    { type: String },
  quantity:    { type: Number, required: true },
  colors:      { type: [String], default: [] },
  sizes:       { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
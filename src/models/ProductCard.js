// models/ProductCard.js
import mongoose from 'mongoose';

const productCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: String,
  description: String,
  price: Number,
  vendor: String,
  tags: [String],
}, { timestamps: true });

export default mongoose.model('ProductCard', productCardSchema);

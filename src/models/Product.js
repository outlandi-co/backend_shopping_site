import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  photos: [{ type: String }], // Array of image paths
  options: [
    {
      color: { type: String },
      images: [{ type: String }] // Array of image paths for each color
    }
  ],
});

const Product = mongoose.model('Product', productSchema);

export default Product;

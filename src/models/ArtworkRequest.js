// models/ArtworkRequest.js
import mongoose from 'mongoose';

const artworkRequestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerName: String,
  email: String,
  artworkUrl: String, // URL to uploaded file
  status: { type: String, default: 'pending' },
}, { timestamps: true });

export default mongoose.model('ArtworkRequest', artworkRequestSchema);

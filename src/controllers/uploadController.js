// src/controllers/uploadController.js
const path = require('path');
const ArtworkSubmission = require('../models/ArtworkSubmission'); // create this if you haven't

// ✅ Upload Artwork and optionally save to DB
const uploadArtwork = async (req, res) => {
  try {
    const file = req.file;
    const { productId } = req.body;

    if (!file || !productId) {
      return res.status(400).json({ message: 'Missing file or productId' });
    }

    const newSubmission = await ArtworkSubmission.create({
      productId,
      imageUrl: `/uploads/artworks/${file.filename}`,
      status: 'pending',
    });

    res.status(200).json({ message: '✅ Artwork submitted', data: newSubmission });
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

module.exports = {
  uploadArtwork
};


// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Artwork = require('../models/Artwork');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/artworks';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/upload-artwork', upload.single('artwork'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const newArtwork = new Artwork({
      productId: req.body.productId || null,
      filePath: req.file.path,
      originalName: req.file.originalname,
    });

    await newArtwork.save();

    res.status(200).json({
      message: '✅ Artwork uploaded successfully',
      artwork: newArtwork,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.get('/artworks', async (req, res) => {
  try {
    const artworks = await Artwork.find().populate('productId', 'name sku');
    res.json(artworks);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

module.exports = router;
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const File = require('./models/File');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, UPLOADS_DIR);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(uploadsDir)); // Serve static files

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Endpoint for file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Save file metadata to MongoDB
  const newFile = new File({
    filename: req.file.filename,
    path: `${UPLOADS_DIR}/${req.file.filename}`,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  try {
    const savedFile = await newFile.save();
    res.json(savedFile);
  } catch (error) {
    console.error('Error saving file metadata:', error);
    res.status(500).json({ error: 'Error saving file metadata' });
  }
});

// Endpoint to get product data
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Shirt', price: 20, image: '/path/to/image1.jpg' },
    { id: 2, name: 'Hoodie', price: 35, image: '/path/to/image2.jpg' },
  ];
  res.json(products);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

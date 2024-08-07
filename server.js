import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with secret key

import sendEmail from './sendEmail.js';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import membershipRoutes from './src/routes/membershipRoutes.js';
import paymentRoutes from './src/paymentRoutes/paymentRoutes.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

const corsOptions = {
  origin: ['http://localhost:5173', 'https://outlandico.netlify.app'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const validMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'image/vnd.adobe.photoshop', 'application/postscript'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    const outputPath = path.join(__dirname, 'uploads', `processed-${file.filename}`);
    fs.renameSync(file.path, outputPath);

    await sendEmail({
      to: 'outlandico@gmail.com',
      subject: 'New File Uploaded',
      text: 'A new file has been uploaded by a customer.',
      attachments: [
        {
          filename: file.originalname,
          path: outputPath
        }
      ]
    });

    res.status(200).json({ message: 'File uploaded and email sent successfully!' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

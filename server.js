// ===== server.js =====
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./src/db');
require('dotenv').config();

const { protect } = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'https://outlandico.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./src/routes/authRoutes');
const membershipRoutes = require('./src/routes/membershipRoutes');
const productRoutes = require('./src/routes/productRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

app.get('/api/products/test', (req, res) => {
  res.json([
    {
      _id: '1',
      name: 'Test Product 1',
      description: 'This is a test product',
      price: 10.99,
      images: ['https://example.com/test-image1.jpg'],
    },
    {
      _id: '2',
      name: 'Test Product 2',
      description: 'This is another test product',
      price: 15.99,
      images: ['https://example.com/test-image2.jpg'],
    },
  ]);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
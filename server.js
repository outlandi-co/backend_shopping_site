const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://outlandi.netlify.app',
  'https://admin-outlandi.netlify.app',
  'https://outlandi.com'
];

// ✅ CORS middleware to support preflight + credentials
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Preflight
  }

  next();
});

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
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

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Unexpected error', error: err.message });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

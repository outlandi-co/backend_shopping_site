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

// ✅ Custom CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Preflight response
  }

  next();
});

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/memberships', require('./src/routes/membershipRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Unexpected server error', error: err.message });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

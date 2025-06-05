require('dotenv').config(); // ✅ Load .env early

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./src/db');

const authRoutes = require('./src/routes/authRoutes');
const membershipRoutes = require('./src/routes/membershipRoutes');
const productRoutes = require('./src/routes/productRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Confirm JWT is loaded
console.log('JWT_SECRET in use:', process.env.JWT_SECRET?.slice(0, 8) + '...');

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Settings
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://outlandi.netlify.app',
  'https://admin-outlandi.netlify.app',
  'https://outlandi.com'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/products', productRoutes); // ✅ keep only one
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// ✅ Check token health route
app.get('/api/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    console.error('JWT verify failed:', err.message);
    res.status(401).json({ loggedIn: false });
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Unexpected server error', error: err.message });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

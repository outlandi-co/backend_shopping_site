const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./src/db'); // Import the connectDB function
require('dotenv').config();

const { protect } = require('./src/middlewares/authMiddleware'); // Import the protect middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://outlandico.netlify.app'], // Add your frontend origins here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const membershipRoutes = require('./src/routes/membershipRoutes');
const productRoutes = require('./src/routes/productRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// Example route for testing products in the backend
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

// Test Route for Basic Functionality
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

// Serve static files from the React app (build directory)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  // Handle any requests that don't match the API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

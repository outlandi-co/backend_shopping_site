// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');

// ✅ Protected route to get user profile
router.get('/profile', protect, getUserProfile);

// ✅ Register a new user
router.post('/register', registerUser);

// ✅ Login route
router.post('/login', loginUser);

// ✅ Forgot password: generate reset token
router.post('/forgot-password', forgotPassword);

// ✅ Reset password using token
router.post('/reset-password/:token', resetPassword);

module.exports = router;

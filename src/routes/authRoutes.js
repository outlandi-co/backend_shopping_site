const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

// 📝 User Registration & Authentication
router.post('/register', registerUser);     // Register
router.post('/login', loginUser);           // Login
router.post('/logout', logoutUser);         // Logout

// 🔐 Password Recovery
// TODO: Add rate limiting to prevent abuse
router.post('/forgot-password', forgotPassword);               // Request reset link
router.post('/reset-password/:token', resetPassword);          // Reset with token


// 👤 User Profile (Protected)
router.get('/profile', protect, getUserProfile);               // Get current user profile
router.get('/check-auth', protect, (req, res) => {             // Simple auth status check
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;

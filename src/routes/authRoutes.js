const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

// 🔐 Rate Limiter for Login Attempts
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit to 5 requests per window per IP
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 📝 User Registration & Authentication
router.post('/register', registerUser);               // Register (consider removing for admin)
router.post('/login', loginRateLimiter, loginUser);   // Login with rate limiter
router.post('/logout', logoutUser);                   // Logout
router.post('/reset-password/test/:token', (req, res) => {
  res.json({ msg: '✅ Reset password route is working!', token: req.params.token });
});


// 🔐 Password Recovery
router.post('/forgot-password', forgotPassword);               // Request reset link
router.post('/reset-password/:token', resetPassword);          // ✅ Correct route

// 👤 User Profile (Protected)
router.get('/profile', protect, getUserProfile);               // Get current user profile
router.get('/check-auth', protect, (req, res) => {             // Simple auth status check
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  getUserProfile
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

// ✅ Register a new user
router.post('/register', registerUser);

// ✅ Login
router.post('/login', loginUser);

// ✅ Logout
router.post('/logout', logoutUser);

// ✅ Forgot password (implement logic inside controller)
router.post('/forgot-password', forgotPassword);

// ✅ Get current user profile (Protected)
router.get('/profile', protect, getUserProfile);

// ✅ Check auth status (for frontend token validation)
router.get('/check-auth', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;

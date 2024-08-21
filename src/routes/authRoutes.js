const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// User logout route
router.post('/logout', logoutUser);

// Forgot password route (implement if needed)
router.post('/forgot-password', forgotPassword);

// User profile route (protected)
router.get('/profile', protect, getUserProfile);

module.exports = router;

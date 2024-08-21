const express = require('express');
const router = express.Router();
const { getUserProfile, registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// User profile route (protected)
router.get('/profile', protect, getUserProfile);

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

module.exports = router;

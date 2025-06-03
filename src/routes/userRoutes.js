const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected
router.get('/profile', protect, getUserProfile);

// Admin-only
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.put('/admin/users/:id', protect, adminOnly, updateUser);
router.delete('/admin/users/:id', protect, adminOnly, deleteUser);

module.exports = router;

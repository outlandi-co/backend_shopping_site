const express = require('express');
const { createMembership, getAllMemberships, deleteMembership } = require('../controllers/membershipController');
const { protect } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public route to view memberships
router.get('/', getAllMemberships);

// Admin-only routes for adding and deleting memberships
router.post('/', protect, authorize('admin'), createMembership);
router.delete('/:id', protect, authorize('admin'), deleteMembership);

module.exports = router;

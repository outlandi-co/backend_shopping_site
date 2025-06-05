const express = require('express');
const router = express.Router();

// ✅ Only one import of the controller methods
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

// Public route to get all products
router.get('/', getProducts);

// Admin-only route to create a new product
router.post('/', protect, adminOnly, addProduct);

// Admin-only route to update a product by ID
router.put('/:id', protect, adminOnly, updateProduct);

// Admin-only route to delete a product by ID
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;

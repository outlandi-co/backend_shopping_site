const express = require('express');
const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

// GET all products (public)
router.get('/', getProducts);

// POST a new product (admin only)
router.post('/', protect, adminOnly, addProduct);

// PUT to update an existing product by ID (admin only)
router.put('/:id', protect, adminOnly, updateProduct);

// DELETE a product by ID (admin only)
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;




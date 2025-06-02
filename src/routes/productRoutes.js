// ✅ routes/productRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// GET all products (with optional pagination)
router.get('/', getProducts);

// POST a new product (vendor field removed)
router.post('/', addProduct);

// PUT to update an existing product by ID
router.put('/:id', updateProduct);

// DELETE a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;

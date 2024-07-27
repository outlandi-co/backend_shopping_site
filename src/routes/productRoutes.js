import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Endpoint to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to create a new product
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { category, name, price, description, quantity, options } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const newProduct = new Product({ category, name, price, description, quantity, options: JSON.parse(options), images });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

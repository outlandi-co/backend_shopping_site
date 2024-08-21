const Product = require('../models/Product');

// Get all products with optional pagination
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Get pagination parameters from the request query
    const products = await Product.find()
                                  .limit(limit * 1)
                                  .skip((page - 1) * limit)
                                  .exec();

    const count = await Product.countDocuments();

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const product = new Product({ name, description, price, category });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add product', error });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete product', error });
  }
};

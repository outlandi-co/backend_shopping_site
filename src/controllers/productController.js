// ✅ controllers/productController.js (updated with filter, pagination, sorting and normalized response)
const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, vendor, category } = req.query;
    const filter = {};

    if (vendor) filter.vendor = vendor;
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

exports.getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({}, 'name description listPrice image category');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch public products', error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      vendor,
      vendors,
      name,
      sku,
      description,
      cost,
      listPrice,
      image,
      category,
      quantity,
      colors,
      sizes
    } = req.body;

    if (!vendor || !name || cost == null || listPrice == null || quantity == null) {
      return res.status(400).json({ message: 'Required fields missing (vendor, name, cost, listPrice, quantity).' });
    }

    const product = new Product({
      vendor: vendor.trim(),
      vendors: Array.isArray(vendors) ? vendors : [],
      name: name.trim(),
      sku: sku?.trim(),
      description: description?.trim(),
      cost: parseFloat(cost),
      listPrice: parseFloat(listPrice),
      image: image?.trim(),
      category: category?.trim(),
      quantity: parseInt(quantity),
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : []
    });

    const savedProduct = await product.save();
    res.status(201).json({ product: savedProduct });
  } catch (error) {
    console.error('❌ Failed to add product:', error.message);
    res.status(400).json({
      message: 'Failed to add product',
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: updatedProduct });
  } catch (error) {
    console.error('❌ Failed to update product:', error.message);
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Failed to delete product:', error.message);
    res.status(400).json({ message: 'Failed to delete product', error: error.message });
  }
};

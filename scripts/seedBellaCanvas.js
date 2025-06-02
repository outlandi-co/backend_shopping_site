const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'your-mongo-connection-string-here';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB connected. Seeding products...');
    return Product.insertMany([
      {
        vendor: 'Bella Canvas',
        name: 'Unisex Jersey Tee',
        sku: '3001',
        description: 'Soft cotton unisex t-shirt. Perfect for screen printing.',
        price: 7.50,
        image: 'https://www.bellacanvas.com/images/products/3001.jpg',
        category: 'T-Shirts',
        quantity: 150,
        colors: ['Black', 'White', 'Heather Grey'],
        sizes: ['S', 'M', 'L', 'XL']
      },
      {
        vendor: 'Bella Canvas',
        name: 'Women’s Racerback Tank',
        sku: '6008',
        description: 'Stylish and lightweight tank top for women.',
        price: 6.95,
        image: 'https://www.bellacanvas.com/images/products/6008.jpg',
        category: 'Tanks',
        quantity: 80,
        colors: ['Pink', 'White', 'Black'],
        sizes: ['XS', 'S', 'M', 'L']
      }
    ]);
  })
  .then(() => {
    console.log('✅ Sample products seeded.');
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
  });

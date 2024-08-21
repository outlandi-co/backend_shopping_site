const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['Basic', 'Premium', 'Ultimate'] // Allowed membership types
  },
  price: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true // Duration in months or another unit
  },
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;

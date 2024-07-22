const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  dateStarted: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  planType: { type: String, required: true }
});

module.exports = mongoose.model('Membership', membershipSchema);

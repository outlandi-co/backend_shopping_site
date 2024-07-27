import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  dateStarted: {
    type: Date,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  planType: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {
    type: String,
    required: true
  }
});

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;

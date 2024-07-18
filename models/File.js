const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
}, { timestamps: true }); // Adding timestamps to track created and updated times

module.exports = mongoose.model('File', FileSchema);

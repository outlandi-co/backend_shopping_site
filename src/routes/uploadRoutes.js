const express = require('express');
const multer = require('multer');
const path = require('path');
const { sendEmail } = require('../controllers/uploadController');
const sanitize = require('sanitize-filename');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${sanitize(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|psd|ai|eps|svg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only images are allowed');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter
});

// POST / - Handle file uploads and send email
router.post('/', upload.single('file'), sendEmail);

module.exports = router;

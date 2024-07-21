import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password' // Replace with your email password
  }
});

export const uploadFile = async (req, res) => {
  try {
    // Send email with attachment
    const mailOptions = {
      from: 'your-email@gmail.com', // Replace with your email
      to: 'your-email@gmail.com', // Replace with your email
      subject: 'New File Upload',
      text: 'A new file has been uploaded by a customer.',
      attachments: [
        {
          filename: req.file.filename,
          path: req.file.path
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email.' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'File uploaded and email sent successfully!' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file.' });
  }
};

export default upload;

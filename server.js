const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const upload = multer({ dest: 'uploads/' });

const corsOptions = {
  origin: ['http://localhost:5173', 'https://outlandico.netlify.app'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Function to overlay images
const overlayImage = async (backgroundPath, overlayPath, outputPath) => {
  try {
    await sharp(backgroundPath)
      .composite([{ input: overlayPath, gravity: 'center' }]) // Adjust gravity as needed
      .toFile(outputPath);
  } catch (error) {
    console.error('Error overlaying image:', error);
    throw error;
  }
};

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const processedPath = path.join('uploads', `processed-${req.file.originalname}`);
    const outputPath = path.join('uploads', `overlayed-${req.file.originalname}`);
    const backgroundPath = path.join(__dirname, 'images', 'shirt.jpg'); // Ensure this path is correct

    console.log(`Uploading file: ${inputPath}`);
    console.log(`Background image path: ${backgroundPath}`);

    // Ensure background image exists
    if (!fs.existsSync(backgroundPath)) {
      console.error(`Background image not found at path: ${backgroundPath}`);
      throw new Error(`Background image not found at path: ${backgroundPath}`);
    }

    // Process the uploaded file (e.g., resize)
    await sharp(inputPath)
      .resize(300) // Example resize
      .toFile(processedPath);

    console.log(`File processed: ${processedPath}`);

    // Overlay the processed file onto the background image
    await overlayImage(backgroundPath, processedPath, outputPath);

    console.log(`Overlay complete: ${outputPath}`);

    res.status(200).send({ message: 'File uploaded and processed successfully', filePath: `uploads/${outputPath}` });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

// Email sending function
const sendEmail = async (to, subject, text, attachmentPath) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider or SMTP server
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password'   // Replace with your email password
    }
  });

  let info = await transporter.sendMail({
    from: '"Your Company" <your-email@gmail.com>',
    to: to,
    subject: subject,
    text: text,
    attachments: [
      {
        filename: path.basename(attachmentPath),
        path: attachmentPath
      }
    ]
  });

  console.log('Message sent: %s', info.messageId);
};

app.post('/api/send-email', async (req, res) => {
  const { email, filePath } = req.body;

  if (!email || !filePath) {
    return res.status(400).send({ message: 'Email and file path are required' });
  }

  try {
    await sendEmail(email, 'Your Customized Image', 'Please find your customized image attached.', filePath);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

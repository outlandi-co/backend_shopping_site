const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Nodemailer Test',
  text: 'If you see this, app password works!'
}, (err, info) => {
  if (err) {
    console.error('❌ Email failed:', err);
  } else {
    console.log('✅ Email sent:', info);
  }
});

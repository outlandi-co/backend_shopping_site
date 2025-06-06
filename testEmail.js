require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Outlandi Admin" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: '✅ Test Email from Node.js',
      text: 'This is a test email.',
    });

    console.log('✅ Email sent successfully:', info.response);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
})();

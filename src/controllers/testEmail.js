// testEmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Outlandi Test" <${process.env.EMAIL_USER}>`,
      to: 'your.other.email@example.com', // ✅ Use a different email to receive
      subject: 'Test Email',
      html: '<p>This is a test email from Outlandi</p>',
    });

    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed to send:', error);
  }
}

testSendEmail();

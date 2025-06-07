const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  console.log('📧 Sending email to:', to);
  console.log('📨 Subject:', subject);
  console.log('🛠 Using EMAIL_USER:', process.env.EMAIL_USER);

  // ✅ Log your env values BEFORE using them
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email server config error:', error.message);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Outlandi Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('📛 SMTP error object:', error);
    throw error;
  }
};

module.exports = sendEmail;

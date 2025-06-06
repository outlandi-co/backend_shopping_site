const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ✅ REGISTER CONTROLLER (Optional for admin access)
exports.registerUser = async (req, res) => {
  res.status(501).json({ message: 'Registration not implemented' });
};

// ✅ LOGIN CONTROLLER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
};

// ✅ LOGOUT CONTROLLER
exports.logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// ✅ FORGOT PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('📩 Forgot password request received for:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log('🔗 Reset link:', resetLink);

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    console.log('✅ Email dispatch attempted');
    res.status(200).json({ message: 'Password reset link sent' });

  } catch (error) {
    console.error('❌ Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to process forgot password', error: error.message });
  }
};

// ✅ RESET PASSWORD CONTROLLER (Updated for token expiry handling)
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: '❌ Token has expired. Please request a new reset link.' });
    }

    res.status(400).json({ message: '❌ Invalid or expired token. Please try again.' });
  }
};

// ✅ GET USER PROFILE CONTROLLER
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

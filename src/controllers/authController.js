const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// 📝 Register a new user
exports.registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  console.log('Incoming role:', role);


  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please provide username, password, and email' });
  }

  try {
    console.log('👉 Incoming role:', role); // ✅ log role for debugging

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
  username: username.trim(),
  email: email.toLowerCase().trim(),
  password: hashedPassword,
  role: role && role.toLowerCase() === 'admin' ? 'admin' : 'user'  // ✅ fixed & safe
});

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ message: 'User registered successfully', role: newUser.role, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// 🔐 Log in a user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// 🚪 Logout a user
exports.logoutUser = (req, res) => {
  res.status(200).json({ message: 'User logged out successfully' });
};

// 👤 Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};

// 📧 Forgot password
exports.forgotPassword = async (req, res) => {
  console.log('📩 forgotPassword route hit');
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    console.log('📨 Reset link generated:', resetLink);

    await sendEmail(
      user.email,
      'Password Reset Request',
      `<p>Hello ${user.username},</p>
       <p>You requested a password reset. Click the link below:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>If you didn’t request this, please ignore this email.</p>`
    );

    return res.status(200).json({ message: 'Reset link sent to email', resetLink });
  } catch (error) {
    console.error('💥 Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to process forgot password', error: error.message });
  }
};

// 🔁 Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Could not reset password', error: error.message });
  }
};

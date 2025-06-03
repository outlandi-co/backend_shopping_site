// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach decoded user info to req.user
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    // ✅ Optional: log user info for debugging
    // console.log('Decoded user:', req.user);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

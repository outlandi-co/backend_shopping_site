// Middleware to restrict access to admin-only routes
exports.adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Internal server error in admin check', error: error.message });
  }
};

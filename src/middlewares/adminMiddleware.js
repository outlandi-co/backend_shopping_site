// Middleware to restrict access to admin-only routes
exports.adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized: No user in request' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next(); // ✅ User is admin, proceed
  } catch (error) {
    console.error('❌ Admin middleware error:', error);
    res.status(500).json({
      message: 'Internal server error during admin role check',
      error: error.message,
    });
  }
};

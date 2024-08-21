// src/middlewares/roleMiddleware.js

const authorize = (roles = []) => {
  // roles param can be a single role string (e.g., 'admin') or an array of roles (e.g., ['admin', 'user'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      // user's role is not authorized
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = authorize;

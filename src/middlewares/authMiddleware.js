const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token from the "Bearer" string
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

      req.user = await User.findById(decoded.userId).select('-password'); // Find the user by ID from the decoded token

      if (!req.user) {
        return res.status(404).json({ message: 'No user found with this token' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

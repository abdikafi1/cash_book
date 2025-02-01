const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Protect routes
// @route   Middleware to check if user is authenticated
// @access  Private
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(' ')[1];

      // Decode the token and verify it using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database based on the decoded ID and exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// @desc    Authorize user based on roles
// @route   Middleware to check if user has the required role(s)
// @access  Private
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user’s role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user.role} is not authorized`);
    }

    // Proceed to the next middleware
    next();
  };
};

module.exports = { protect, authorize };

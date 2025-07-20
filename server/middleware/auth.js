const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretKey'; // Must match the secret used in auth routes

module.exports = function authMiddleware(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1]; // Expect 'Bearer <token>'

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

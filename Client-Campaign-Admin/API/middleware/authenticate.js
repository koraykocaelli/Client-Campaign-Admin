const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret';

const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else {
      res.status(400).json({ error: 'Invalid token' });
    }
  }
};

module.exports = authenticate;

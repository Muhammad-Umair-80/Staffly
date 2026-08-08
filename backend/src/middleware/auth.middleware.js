const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');

async function authenticateAdmin(req, res, next) {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}

module.exports = { authenticateAdmin };

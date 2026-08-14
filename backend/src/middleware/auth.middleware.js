const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = req.cookies.token || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    if (admin.status === 'disabled') {
      return res.status(403).json({ message: 'Your admin account has been disabled' });
    }

    req.user = decoded;
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
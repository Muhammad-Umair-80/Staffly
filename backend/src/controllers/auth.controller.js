const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const bcrypt = require('bcryptjs');

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      // Do not reveal whether email or password is incorrect
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.status === 'disabled') {
      return res.status(403).json({ message: 'Your admin account has been disabled' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Return token in body as frontend expects it while cookie is the main auth mechanism
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: admin._id, email: admin.email, name: admin.name, role: admin.role, status: admin.status },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function getCurrentAdmin(req, res) {
  if (!req.admin) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Return only safe admin information
  res.status(200).json({
    user: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
      status: req.admin.status,
      createdAt: req.admin.createdAt,
    },
  });
}

module.exports = { loginAdmin, getCurrentAdmin };

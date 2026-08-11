const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const bcrypt = require('bcryptjs');
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;


    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // const isMatch = await bcrypt.compare(password, admin.password);

    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }

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

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: admin._id, email: admin.email },
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

  res.status(200).json({
    user: {
      id: req.admin._id,
      email: req.admin.email,
    },
  });
}

module.exports = { loginAdmin, getCurrentAdmin };

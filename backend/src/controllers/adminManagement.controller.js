const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin.model');

// Helper to remove sensitive fields
function safeAdmin(admin) {
  if (!admin) return null;
  const { _id, name, email, role, status, createdAt, updatedAt } = admin;
  return { id: _id, name, email, role, status, createdAt, updatedAt };
}

async function createAdmin(req, res) {
  try {
    // only super_admin middleware should protect route, but double-check
    if (!req.admin || req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name: bodyName, username, email, password, role: requestedRole } = req.body;
    const name = String(bodyName || username || '').trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // validate simple email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Determine role: default to 'admin'. Only allow 'super_admin' when requester is super_admin and explicitly requested.
    let finalRole = 'admin';
    if (requestedRole === 'super_admin' && req.admin && req.admin.role === 'super_admin') {
      finalRole = 'super_admin';
    }

    const newAdmin = new Admin({
      name: name,
      username: normalizedEmail,
      email: normalizedEmail,
      password: hashed,
      role: finalRole,
    });

    await newAdmin.save();

    return res.status(201).json({ admin: safeAdmin(newAdmin) });
  } catch (err) {
    console.error('Error creating admin:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAdmins(req, res) {
  try {
    if (!req.admin) return res.status(401).json({ message: 'Not authenticated' });

    const admins = await Admin.find({}, '-password').sort({ createdAt: -1 });

    const safe = admins.map((a) => safeAdmin(a));
    return res.status(200).json({ admins: safe });
  } catch (err) {
    console.error('Error fetching admins:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAdminById(req, res) {
  try {
    if (!req.admin) return res.status(401).json({ message: 'Not authenticated' });

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const admin = await Admin.findById(id, '-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    return res.status(200).json({ admin: safeAdmin(admin) });
  } catch (err) {
    console.error('Error fetching admin:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateAdmin(req, res) {
  try {
    if (!req.admin) return res.status(401).json({ message: 'Not authenticated' });

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const target = await Admin.findById(id);
    if (!target) return res.status(404).json({ message: 'Admin not found' });

    const { name, email, role, password } = req.body;

    // Only super_admin can change roles
    if (role && String(role) !== String(target.role)) {
      if (req.admin.role !== 'super_admin') {
        return res.status(403).json({ message: 'Only super_admin can change admin roles' });
      }
      // prevent normal admin from promoting themselves if they try to change role via API
      if (String(req.admin._id) === String(target._id) && role !== target.role && req.admin.role !== 'super_admin') {
        return res.status(403).json({ message: 'Cannot change your own role' });
      }
      // enforce allowed values
      if (!['admin', 'super_admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      target.role = role;
    }

    if (name) target.name = String(name).trim();
    if (email) target.email = String(email).trim().toLowerCase();

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      target.password = hashed;
    }

    await target.save();

    return res.status(200).json({ admin: safeAdmin(target) });
  } catch (err) {
    console.error('Error updating admin:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function disableAdmin(req, res) {
  try {
    if (!req.admin || req.admin.role !== 'super_admin') return res.status(403).json({ message: 'Forbidden' });

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const target = await Admin.findById(id);
    if (!target) return res.status(404).json({ message: 'Admin not found' });

    target.status = 'disabled';
    await target.save();

    return res.status(200).json({ message: 'Admin disabled' });
  } catch (err) {
    console.error('Error disabling admin:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createAdmin, getAdmins, getAdminById, updateAdmin, disableAdmin };
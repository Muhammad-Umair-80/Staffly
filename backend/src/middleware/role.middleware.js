function requireSuperAdmin(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden: requires super_admin role' });
  }

  next();
}

module.exports = { requireSuperAdmin };
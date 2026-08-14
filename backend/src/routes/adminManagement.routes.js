const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireSuperAdmin } = require('../middleware/role.middleware');
const adminController = require('../controllers/adminManagement.controller');

// All routes require authentication
router.post('/admins', authMiddleware, requireSuperAdmin, adminController.createAdmin);
router.get('/admins', authMiddleware, adminController.getAdmins);
router.get('/admins/:id', authMiddleware, adminController.getAdminById);
router.put('/admins/:id', authMiddleware, adminController.updateAdmin);
router.patch('/admins/:id/disable', authMiddleware, requireSuperAdmin, adminController.disableAdmin);

module.exports = router;
const express = require('express');
const { loginAdmin, getCurrentAdmin } = require('../controllers/auth.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/admin
 * @desc Login an admin user
 * @access Public
 */
router.post('/admin', loginAdmin);

/**
 * @route GET /api/auth/me
 * @route GET /api/auth/get-me
 * @desc Return the current authenticated admin
 * @access Private
 */
router.get('/me', authenticateAdmin, getCurrentAdmin);
router.get('/get-me', authenticateAdmin, getCurrentAdmin);

module.exports = router;
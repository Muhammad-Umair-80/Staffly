const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/admin
 * @desc Create a new admin
 * @access Public
 */

const authController = require('../controllers/auth.controller');

router.post('/admin', authController.loginAdmin);


router.get('/get-me', authMiddleware.authMiddleware, authController.getMe);


/**
 * @route POST /api/auth/employees
 * description: Create a new employee
 * @access Private (Admin only)
 */

const employeeController = require('../controllers/employee.controller');

router.post('/employees', authMiddleware.authMiddleware, employeeController.saveEmployee);











module.exports = router;
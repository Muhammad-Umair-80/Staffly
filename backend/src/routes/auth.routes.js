const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/admin
 * @desc Create a new admin
 * @access Public
 */

const authController = require('../controllers/auth.controller');

// Log types to help diagnose 'argument handler must be a function' errors during startup
console.log('[auth.routes] typeof authController.loginAdmin =', typeof authController.loginAdmin);
router.post('/admin', authController.loginAdmin);


router.get('/get-me', authMiddleware.authMiddleware, authController.getCurrentAdmin);


/**
 * @route POST /api/auth/employees
 * description: Create a new employee
 * @access Private (Admin only)
 */

const employeeController = require('../controllers/employee.controller');

// Log types for the middleware and handler used here
console.log('[auth.routes] typeof authMiddleware.authMiddleware =', typeof authMiddleware.authMiddleware);
console.log('[auth.routes] typeof employeeController.saveEmployee =', typeof employeeController.saveEmployee);
router.post('/employees', authMiddleware.authMiddleware, employeeController.saveEmployee);









module.exports = router;
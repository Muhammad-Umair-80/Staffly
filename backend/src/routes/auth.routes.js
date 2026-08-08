const express = require('express');


const router = express.Router();

/**
 * @route POST /api/auth/admin
 * @desc Create a new admin
 * @access Public
 */

const { loginAdmin } = require('../controllers/auth.controller');

router.post('/admin', loginAdmin);











module.exports = router;
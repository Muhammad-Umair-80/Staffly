const express = require('express');
const { saveEmployee } = require('../controllers/employee.controller');

const router = express.Router();

// POST /employees and POST /api/employees
router.post('/', saveEmployee);

module.exports = router;

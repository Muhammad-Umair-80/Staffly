const express = require('express');
const multer = require('multer');
const { saveEmployee } = require('../controllers/employee.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Accept either image or profileImage field names for file uploads.
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
]);

// POST /employees and POST /api/employees
router.post('/', uploadFields, saveEmployee);

module.exports = router;

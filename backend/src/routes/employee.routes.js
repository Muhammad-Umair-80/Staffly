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

// Ensure only functions are passed to the router. Wrap uploadFields with a guard
// so that if for some reason it's not a function, it won't be passed directly
// to router.post (which would throw "argument handler must be a function").
const guardedUpload = (req, res, next) => {
  if (typeof uploadFields === 'function') {
    return uploadFields(req, res, next);
  }
  // No upload middleware available; continue to next handler.
  return next();
};

// Diagnostic logs to help find non-function values at registration time
console.log('[employee.routes] typeof guardedUpload =', typeof guardedUpload);
console.log('[employee.routes] typeof saveEmployee =', typeof saveEmployee);

// POST /employees and POST /api/employees
router.post('/', guardedUpload, saveEmployee);

module.exports = router;

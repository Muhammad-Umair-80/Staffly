const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employee.controller');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
]);

router.post('/', authMiddleware, uploadFields, createEmployee);
router.get('/', authMiddleware, getEmployees);
router.get('/:id', authMiddleware, getEmployeeById);
router.put('/:id', authMiddleware, uploadFields, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);

module.exports = router;

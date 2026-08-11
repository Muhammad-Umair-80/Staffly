const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  uploadDocument,
  getEmployeeDocuments,
  deleteDocument,
} = require('../controllers/document.controller');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]);

// POST /api/employees/:employeeId/documents
router.post('/employees/:employeeId/documents', authMiddleware, uploadFields, uploadDocument);
// GET /api/employees/:employeeId/documents
router.get('/employees/:employeeId/documents', authMiddleware, getEmployeeDocuments);
// DELETE /api/documents/:documentId
router.delete('/documents/:documentId', authMiddleware, deleteDocument);

module.exports = router;

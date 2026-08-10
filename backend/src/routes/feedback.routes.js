const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  createFeedback,
  getFeedbackForEmployee,
  deleteFeedback,
} = require('../controllers/feedback.controller');

const router = express.Router();

// POST /api/employees/:employeeId/feedback
router.post('/employees/:employeeId/feedback', authMiddleware, createFeedback);
// GET /api/employees/:employeeId/feedback
router.get('/employees/:employeeId/feedback', authMiddleware, getFeedbackForEmployee);
// DELETE /api/feedback/:feedbackId
router.delete('/feedback/:feedbackId', authMiddleware, deleteFeedback);

module.exports = router;
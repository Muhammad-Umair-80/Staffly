const mongoose = require('mongoose');
const FeedbackModel = require('../models/feedback.model');
const Employee = require('../models/employee.model');

/**
 * POST /api/employees/:employeeId/feedback
 */
const createFeedback = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { rating, comment } = req.body;

    // Authenticated admin should be available on req.admin
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing employeeId' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
    }

    if (!comment || String(comment).trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const feedback = await FeedbackModel.create({
      employee: employeeId,
      rating: parsedRating,
      comment: String(comment).trim(),
      givenBy: admin._id,
    });

    return res.status(201).json({ success: true, message: 'Feedback added successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({ success: false, message: 'Unable to add feedback', error: error.message });
  }
};

/**
 * GET /api/employees/:employeeId/feedback
 */
const getFeedbackForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing employeeId' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const feedbacks = await FeedbackModel.find({ employee: employeeId })
      .sort({ createdAt: -1 })
      .populate('givenBy', 'email');

    return res.status(200).json({ success: true, feedback: feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch feedback', error: error.message });
  }
};

/**
 * DELETE /api/feedback/:feedbackId
 */
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    if (!feedbackId || !mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ success: false, message: 'Invalid feedback ID' });
    }

    const feedback = await FeedbackModel.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    return res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete feedback', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackForEmployee,
  deleteFeedback,
};

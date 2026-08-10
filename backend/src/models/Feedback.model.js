const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;

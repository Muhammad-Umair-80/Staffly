const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: {
      type: String,
      required: true,
      enum: ['planning', 'active', 'completed', 'on-hold'],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;

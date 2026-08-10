const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    profileImage: {
      type: {
        url: { type: String, trim: true },
        fileId: { type: String, trim: true },
      },
      default: null,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    employmentStatus: {
      type: String,
      enum: ['active', 'on-leave', 'archived'],
      default: 'active',
      leavingDate: {
        type: Date,
      },
    leavingReason: {
      type: String,
      trim: true,   
      },
      lowercase: true,
      trim: true,
    },
    reportingTo: {
      type: String,
      trim: true,
    },
    currentProject: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;


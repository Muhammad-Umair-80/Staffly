const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'Employee',
    },
    department: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    joiningDate: {
      type: Date,
    },
    employeeStatus: {
      type: String,
      enum: ['active', 'on-leave', 'archived'],
      default: 'active',
      lowercase: true,
      trim: true,
    },
    reportingTo: {
      type: String,
      trim: true,
    },
    currentProject: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.index({ employeeId: 1 }, { unique: true, sparse: true });
EmployeeSchema.index({ email: 1 }, { unique: true, sparse: true });

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;


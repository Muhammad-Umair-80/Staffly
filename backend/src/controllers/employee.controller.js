const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
const { uploadImage } = require('../services/imagekit.service');

const allowedFields = [
  'employeeId',
  'fullName',
  'email',
  'phone',
  'role',
  'department',
  'city',
  'address',
  'joiningDate',
  'employmentStatus',
  'reportingTo',
  'currentProject',
];

function toEmployeePayload(body, uploadedImage) {
  const payload = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field) && body[field] !== undefined) {
      payload[field] = body[field];
    }
  });

  if (uploadedImage) {
    payload.profileImage = uploadedImage;
  }

  return payload;
}

function buildImagePayload(file) {
  if (!file) {
    return null;
  }

  return {
    url: file.url || file.filePath || '',
    fileId: file.fileId || '',
  };
}

function validateEmployeePayload(payload) {
  const errors = {};

  if (!payload.employeeId || !String(payload.employeeId).trim()) {
    errors.employeeId = 'Employee ID is required.';
  }

  if (!payload.fullName || !String(payload.fullName).trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!payload.email || !String(payload.email).trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email).trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!payload.phone || !String(payload.phone).trim()) {
    errors.phone = 'Phone is required.';
  }

  if (!payload.role || !String(payload.role).trim()) {
    errors.role = 'Role is required.';
  }

  if (!payload.department || !String(payload.department).trim()) {
    errors.department = 'Department is required.';
  }

  if (!payload.city || !String(payload.city).trim()) {
    errors.city = 'City is required.';
  }

  if (!payload.joiningDate) {
    errors.joiningDate = 'Joining date is required.';
  } else if (Number.isNaN(new Date(payload.joiningDate).getTime())) {
    errors.joiningDate = 'Joining date must be a valid date.';
  }

  if (payload.employmentStatus && !['active', 'on-leave', 'archived'].includes(payload.employmentStatus)) {
    errors.employmentStatus = 'Employment status must be active, on-leave, or archived.';
  }

  if (payload.email) {
    payload.email = String(payload.email).trim().toLowerCase();
  }

  if (payload.employeeId) {
    payload.employeeId = String(payload.employeeId).trim();
  }

  return errors;
}

async function createEmployee(req, res) {
  try {
    const file =
      req.file ||
      (req.files && ((req.files.image && req.files.image[0]) || (req.files.profileImage && req.files.profileImage[0])));

    const payload = toEmployeePayload(req.body, null);
    const validationErrors = validateEmployeePayload(payload);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors: validationErrors });
    }

    if (file) {
      if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
        return res.status(500).json({ success: false, message: 'ImageKit configuration is missing.' });
      }

      const uploadResult = await uploadImage(file.buffer, file.originalname);
      payload.profileImage = buildImagePayload(uploadResult);
    }

    const existingEmployee = await Employee.findOne({
      $or: [{ email: payload.email }, { employeeId: payload.employeeId }],
    });

    if (existingEmployee) {
      if (existingEmployee.email === payload.email) {
        return res.status(409).json({ success: false, message: 'Email is already registered.' });
      }

      return res.status(409).json({ success: false, message: 'Employee ID already exists.' });
    }

    const employee = await Employee.create(payload);

    return res.status(201).json({ success: true, message: 'Employee created successfully', employee });
  } catch (error) {
    console.error('Error creating employee:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Please provide valid employee details.', errors: error.errors });
    }

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email or Employee ID already exists.' });
    }

    return res.status(500).json({ success: false, message: 'Unable to create employee.' });
  }
}

async function getEmployees(req, res) {
  try {
    const employees = await Employee.find({ employmentStatus: { $ne: 'archived' } })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch employees.' });
  }
}

async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID.' });
    }

    const employee = await Employee.findById(id).lean();

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch employee.' });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID.' });
    }

    const payload = toEmployeePayload(req.body, null);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, message: 'No employee updates were provided.' });
    }

    const validationErrors = validateEmployeePayload({ ...payload, employmentStatus: payload.employmentStatus || 'active' });
    const requiredFields = ['employeeId', 'fullName', 'email', 'phone', 'role', 'department', 'city', 'joiningDate'];

    requiredFields.forEach((field) => {
      if (payload[field] === undefined) {
        delete validationErrors[field];
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors: validationErrors });
    }

    if (payload.email) {
      const normalizedEmail = String(payload.email).trim().toLowerCase();
      const existingEmployee = await Employee.findOne({ email: normalizedEmail, _id: { $ne: id } });
      if (existingEmployee) {
        return res.status(409).json({ success: false, message: 'Email is already registered.' });
      }
      payload.email = normalizedEmail;
    }

    if (payload.employeeId) {
      const normalizedEmployeeId = String(payload.employeeId).trim();
      const existingEmployee = await Employee.findOne({ employeeId: normalizedEmployeeId, _id: { $ne: id } });
      if (existingEmployee) {
        return res.status(409).json({ success: false, message: 'Employee ID already exists.' });
      }
      payload.employeeId = normalizedEmployeeId;
    }

    const employee = await Employee.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.status(200).json({ success: true, message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Please provide valid employee details.', errors: error.errors });
    }

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email or Employee ID already exists.' });
    }

    return res.status(500).json({ success: false, message: 'Unable to update employee.' });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID.' });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete employee.' });
  }
}

async function saveEmployee(req, res) {
  return createEmployee(req, res);
}

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  saveEmployee,
};

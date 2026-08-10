const mongoose = require('mongoose');
const Project = require('../models/project.model');
const Employee = require('../models/employee.model');

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

async function validateAssignedEmployees(assignedEmployees) {
  if (!assignedEmployees) {
    return [];
  }

  if (!Array.isArray(assignedEmployees)) {
    throw new Error('assignedEmployees must be an array');
  }

  const normalizedIds = assignedEmployees.filter(Boolean);
  const invalidIds = normalizedIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new Error('One or more assigned employee IDs are invalid');
  }

  const employees = await Employee.find({ _id: { $in: normalizedIds } }).select('_id');
  const foundIds = employees.map((employee) => employee._id.toString());
  const missingIds = normalizedIds.filter((id) => !foundIds.includes(id));

  if (missingIds.length > 0) {
    throw new Error('One or more assigned employees were not found');
  }

  return normalizedIds;
}

async function createProject(req, res) {
  try {
    const { name, description = '', status, startDate, endDate, assignedEmployees } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Project name is required.' });
    }

    const normalizedStatus = String(status || '').trim();
    if (!['planning', 'active', 'completed', 'on-hold'].includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid project status.' });
    }

    const parsedStartDate = new Date(startDate);
    if (!startDate || Number.isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Start date is required.' });
    }

    const parsedEndDate = endDate ? new Date(endDate) : null;
    if (parsedEndDate && parsedEndDate < parsedStartDate) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
    }

    const normalizedAssignedEmployees = await validateAssignedEmployees(assignedEmployees);

    const project = await Project.create({
      name: String(name).trim(),
      description: String(description || '').trim(),
      status: normalizedStatus,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      assignedEmployees: normalizedAssignedEmployees,
    });

    return res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.message.includes('assignedEmployees')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Unable to create project.' });
  }
}

async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).populate('assignedEmployees', 'fullName profileImage role employeeId');
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch projects.' });
  }
}

async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(id).populate('assignedEmployees', 'fullName profileImage role employeeId');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch project.' });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const updates = { ...req.body };
    const allowedFields = ['name', 'description', 'status', 'startDate', 'endDate', 'assignedEmployees'];
    const payload = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        payload[field] = updates[field];
      }
    });

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, message: 'No project updates were provided.' });
    }

    if (payload.name !== undefined && !String(payload.name).trim()) {
      return res.status(400).json({ success: false, message: 'Project name is required.' });
    }

    if (payload.status !== undefined) {
      const normalizedStatus = String(payload.status).trim();
      if (!['planning', 'active', 'completed', 'on-hold'].includes(normalizedStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid project status.' });
      }
      payload.status = normalizedStatus;
    }

    if (payload.startDate !== undefined) {
      const parsedStartDate = new Date(payload.startDate);
      if (!payload.startDate || Number.isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Start date is required.' });
      }
      payload.startDate = parsedStartDate;
    }

    if (payload.endDate !== undefined && payload.endDate !== null && payload.endDate !== '') {
      const parsedEndDate = new Date(payload.endDate);
      if (Number.isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({ success: false, message: 'End date must be a valid date.' });
      }
      payload.endDate = parsedEndDate;
    } else if (payload.endDate === null || payload.endDate === '') {
      payload.endDate = null;
    }

    if (payload.startDate !== undefined && payload.endDate !== undefined && payload.endDate && payload.endDate < payload.startDate) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
    }

    if (payload.assignedEmployees !== undefined) {
      payload.assignedEmployees = await validateAssignedEmployees(payload.assignedEmployees);
    }

    const project = await Project.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('assignedEmployees', 'fullName profileImage role employeeId');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.status(200).json({ success: true, message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.message.includes('assignedEmployees')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Unable to update project.' });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete project.' });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

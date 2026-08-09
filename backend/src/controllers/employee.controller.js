const Employee = require('../models/employee.model');
const { uploadImage } = require('../services/imagekit.service');

async function saveEmployee(req, res) {
  try {
    const employeeData = {
      ...req.body,
      profileImage: req.body.profileImage || '',
    };

    const file =
      req.file ||
      (req.files && ((req.files.image && req.files.image[0]) || (req.files.profileImage && req.files.profileImage[0])));

    if (file) {
      const fileBase64 = file.buffer.toString('base64');
      const fileName = file.originalname;

      if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
        console.error('ImageKit config missing:', {
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        });
        return res.status(500).json({ message: 'ImageKit configuration is missing' });
      }

      const uploadResult = await uploadImage(file.buffer, fileName);
      employeeData.profileImage = uploadResult.url || uploadResult.filePath || '';
    }

    const newEmployee = new Employee(employeeData);
    const savedEmployee = await newEmployee.save();

    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error saving employee:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value detected.',
        duplicateKey: error.keyValue,
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { saveEmployee };

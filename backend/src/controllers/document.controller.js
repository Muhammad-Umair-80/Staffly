const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
const DocumentModel = require('../models/documents.model');
const { uploadImage } = require('../services/imagekit.service');
const ImageKit = require('@imagekit/nodejs');

const ALLOWED_TYPES = ['resume', 'contract', 'certificate', 'id-document', 'offer-letter', 'other'];

/**
 * POST /api/employees/:employeeId/documents
 */
async function uploadDocument(req, res) {
  try {
    const { employeeId } = req.params;

    // Authenticated admin is expected on req.admin by auth middleware
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

    // file may be in req.file (single) or req.files.file
    const file = req.file || (req.files && ((req.files.file && req.files.file[0]) || (req.files.document && req.files.document[0])));

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { type } = req.body || {};
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing document type' });
    }

    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
      return res.status(500).json({ success: false, message: 'ImageKit configuration is missing.' });
    }

    // Upload using existing helper
    const uploadResult = await uploadImage(file.buffer, file.originalname);

    const fileUrl = uploadResult?.url || uploadResult?.filePath || '';
    const fileId = uploadResult?.fileId || uploadResult?.file_id || '';

    const document = await DocumentModel.create({
      employee: employeeId,
      name: file.originalname || (file.filename || 'document'),
      type,
      fileUrl,
      fileId,
      uploadedBy: admin._id,
    });

    return res.status(201).json({ success: true, message: 'Document uploaded successfully', document });
  } catch (error) {
    console.error('Error uploading document:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Please provide valid document details.', errors: error.errors });
    }

    return res.status(500).json({ success: false, message: 'Unable to upload document.' });
  }
}

/**
 * GET /api/employees/:employeeId/documents
 */
async function getEmployeeDocuments(req, res) {
  try {
    const { employeeId } = req.params;

    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing employeeId' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const documents = await DocumentModel.find({ employee: employeeId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'email');

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch documents.' });
  }
}

/**
 * DELETE /api/documents/:documentId
 */
async function deleteDocument(req, res) {
  try {
    const { documentId } = req.params;

    if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ success: false, message: 'Invalid document ID' });
    }

    const document = await DocumentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
      return res.status(500).json({ success: false, message: 'ImageKit configuration is missing.' });
    }

    // Delete from ImageKit first
    try {
      const imagekit = new ImageKit({ publicKey: process.env.IMAGEKIT_PUBLIC_KEY, privateKey: process.env.IMAGEKIT_PRIVATE_KEY });

      // Try common SDK methods, prefer promise API if available
      if (typeof imagekit.deleteFile === 'function') {
        // some SDK versions expose deleteFile
        await imagekit.deleteFile(document.fileId);
      } else if (imagekit.files && typeof imagekit.files.delete === 'function') {
        // alternative shape
        await imagekit.files.delete({ fileId: document.fileId });
      } else if (imagekit.files && typeof imagekit.files.deleteFile === 'function') {
        await imagekit.files.deleteFile(document.fileId);
      } else {
        // Last resort: try delete with fileId as object
        if (typeof imagekit.files === 'object' && typeof imagekit.files.delete === 'function') {
          await imagekit.files.delete(document.fileId);
        } else {
          throw new Error('ImageKit delete method not available');
        }
      }
    } catch (err) {
      console.error('Error deleting file from ImageKit:', err);
      return res.status(500).json({ success: false, message: 'Unable to delete file from storage.' });
    }

    // Remove DB record
    await DocumentModel.findByIdAndDelete(documentId);

    return res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete document.' });
  }
}

module.exports = {
  uploadDocument,
  getEmployeeDocuments,
  deleteDocument,
};
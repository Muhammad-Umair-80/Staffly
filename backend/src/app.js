require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

/**
 * @route POST /api/auth/admin
 * @desc Create a new admin
 * @access Public
 */
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const projectRoutes = require('./routes/project.routes');
const documentRoutes = require('./routes/document.routes');
const adminManagementRoutes = require('./routes/adminManagement.routes');

app.use('/api/auth', authRoutes);
app.use(['/employee', '/employees', '/api/employee', '/api/employees'], employeeRoutes);
// Mount feedback routes at /api so routes defined as /employees/:employeeId/feedback and /feedback/:feedbackId work
app.use('/api', feedbackRoutes);
app.use('/api', projectRoutes);
app.use('/api', documentRoutes);
// Admin management routes
app.use('/api', adminManagementRoutes);

module.exports = app;

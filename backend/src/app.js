require('dotenv').config;
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * @route POST /api/auth/admin
 * @desc Create a new admin
 * @access Public
 */
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

module.exports = app;
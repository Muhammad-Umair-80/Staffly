const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

const router = express.Router();

router.post('/projects', authMiddleware, createProject);
router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:id', authMiddleware, getProjectById);
router.put('/projects/:id', authMiddleware, updateProject);
router.delete('/projects/:id', authMiddleware, deleteProject);

module.exports = router;

import express from 'express';
import { getProjects, createProject, getProjectById, getUsers, updateProjectMembers, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.get('/users', protect, getUsers);
router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
router.put('/:id/members', protect, updateProjectMembers);

export default router;

import express from 'express';
import { getTasksByProject, createTask, updateTaskStatus, updateTask, deleteTask, addComment, uploadAttachment } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id/status')
  .put(protect, updateTaskStatus);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/attachments')
  .post(protect, upload.single('file'), uploadAttachment);

export default router;

import express from 'express';
import { getAllUsers, updateUserRole } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;

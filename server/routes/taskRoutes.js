import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', validateObjectId('id'), getTaskById);
router.put('/:id', validateObjectId('id'), updateTask);
router.delete('/:id', validateObjectId('id'), deleteTask);

export default router;

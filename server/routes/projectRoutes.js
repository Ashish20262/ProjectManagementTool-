import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', validateObjectId('id'), getProjectById);
router.put('/:id', validateObjectId('id'), updateProject);
router.delete('/:id', validateObjectId('id'), deleteProject);

export default router;

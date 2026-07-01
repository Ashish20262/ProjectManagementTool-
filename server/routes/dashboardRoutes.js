import express from 'express';
import { getDashboardStats, getDashboardCharts } from '../controllers/dashboardController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/stats', getDashboardStats);
router.get('/charts', getDashboardCharts);

export default router;

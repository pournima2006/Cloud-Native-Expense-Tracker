import { Router } from 'express';
import { generateAndSendReport } from '../controllers/reportController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/send-monthly', isAuthenticated, generateAndSendReport);

export default router;

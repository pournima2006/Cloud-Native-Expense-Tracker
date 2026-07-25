import { Router } from 'express';
import { scanReceipt } from '../controllers/ocrController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/scan', isAuthenticated, upload.single('receipt'), scanReceipt);

export default router;

import { Router } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategories,
  getAnalytics
} from '../controllers/expenseController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

// Publicly readable categories (defaults)
router.get('/categories', getCategories);

// Protect all other expense routes
router.use(isAuthenticated);

router.get('/', getExpenses);
router.get('/analytics', getAnalytics);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;

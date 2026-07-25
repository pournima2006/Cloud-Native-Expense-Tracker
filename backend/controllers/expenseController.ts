import { Request, Response } from 'express';
import { db } from '../config/db.js';

export const getExpenses = async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const { category_id, start_date, end_date, search } = req.query;

  try {
    const [expenses]: any = await db.execute(
      'SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY e.expense_date DESC, e.id DESC',
      [userId]
    );

    let filtered = expenses || [];

    if (category_id) {
      filtered = filtered.filter((e: any) => e.category_id === Number(category_id));
    }

    if (start_date) {
      filtered = filtered.filter((e: any) => e.expense_date >= String(start_date));
    }

    if (end_date) {
      filtered = filtered.filter((e: any) => e.expense_date <= String(end_date));
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter((e: any) =>
        e.merchant_name.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        (e.category_name && e.category_name.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, expenses: filtered });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve expenses.' });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const { id } = req.params;

  try {
    const [expenses]: any = await db.execute(
      'SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.id = ? AND e.user_id = ?',
      [id, userId]
    );

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' });
    }

    return res.json({ success: true, expense: expenses[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving expense detail.' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const { category_id, merchant_name, amount, expense_date, notes, receipt_url, image_url, imageUrl, raw_ocr_text } = req.body;

  if (!category_id || !merchant_name || amount === undefined || amount === null || !expense_date) {
    return res.status(400).json({ success: false, message: 'Category, Merchant Name, Amount, and Expense Date are required.' });
  }

  try {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
    }

    const rawUrl = image_url || imageUrl || receipt_url || null;
    const finalImageUrl = rawUrl ? String(rawUrl) : null;
    const finalReceiptUrl = rawUrl ? String(rawUrl) : null;

    const [result]: any = await db.execute(
      'INSERT INTO expenses (user_id, category_id, merchant_name, amount, expense_date, notes, receipt_url, image_url, raw_ocr_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, Number(category_id), merchant_name, numericAmount, expense_date, notes || '', finalReceiptUrl, finalImageUrl, raw_ocr_text || '']
    );

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      expenseId: result.insertId
    });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ success: false, message: 'Failed to create expense record.' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const { id } = req.params;
  const { category_id, merchant_name, amount, expense_date, notes } = req.body;

  try {
    const numericAmount = parseFloat(amount);

    const [result]: any = await db.execute(
      'UPDATE expenses SET category_id = ?, merchant_name = ?, amount = ?, expense_date = ?, notes = ? WHERE id = ? AND user_id = ?',
      [Number(category_id), merchant_name, numericAmount, expense_date, notes || '', id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Expense record not found or not authorized.' });
    }

    return res.json({ success: true, message: 'Expense updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update expense.' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const { id } = req.params;

  try {
    const [result]: any = await db.execute(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Expense not found or unauthorized.' });
    }

    return res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete expense.' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const userId = req.session?.userId || 0;

  try {
    const [categories]: any = await db.execute(
      'SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY id ASC',
      [userId]
    );

    return res.json({ success: true, categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  const userId = req.session.userId!;

  try {
    const [expenses]: any = await db.execute(
      'SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY e.expense_date DESC',
      [userId]
    );

    const list = expenses || [];
    const totalSpend = list.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

    // Group by category
    const categoryMap: { [key: string]: { name: string; amount: number; color: string; icon: string; count: number } } = {};

    list.forEach((e: any) => {
      const name = e.category_name || 'General / Other';
      const color = e.category_color || '#6B7280';
      const icon = e.category_icon || 'Tag';
      if (!categoryMap[name]) {
        categoryMap[name] = { name, amount: 0, color, icon, count: 0 };
      }
      categoryMap[name].amount += Number(e.amount);
      categoryMap[name].count += 1;
    });

    const categoryBreakdown = Object.values(categoryMap).map(c => ({
      ...c,
      percentage: totalSpend > 0 ? (c.amount / totalSpend) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    // Monthly breakdown for trend chart
    const monthlyMap: { [key: string]: number } = {};
    list.forEach((e: any) => {
      const monthKey = e.expense_date.substring(0, 7); // YYYY-MM
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + Number(e.amount);
    });

    const monthlyTrend = Object.keys(monthlyMap).sort().map(month => ({
      month,
      amount: monthlyMap[month]
    }));

    // Recent 5 transactions
    const recentTransactions = list.slice(0, 5);

    return res.json({
      success: true,
      summary: {
        totalSpend,
        totalTransactions: list.length,
        averageExpense: list.length > 0 ? totalSpend / list.length : 0,
        categoryBreakdown,
        monthlyTrend,
        recentTransactions
      }
    });
  } catch (error: any) {
    console.error('Error in analytics:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate analytics.' });
  }
};

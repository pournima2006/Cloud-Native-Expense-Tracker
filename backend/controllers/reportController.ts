import { Request, Response } from 'express';
import { db } from '../config/db.js';
import { sendMonthlyReportEmail } from '../services/emailService.js';

export const generateAndSendReport = async (req: Request, res: Response) => {
  const userId = req.session.userId!;
  const userEmail = req.session.email!;
  const username = req.session.username || 'User';

  const { targetMonth } = req.body; // YYYY-MM string, e.g. "2026-07"
  const currentMonth = targetMonth || new Date().toISOString().substring(0, 7);

  try {
    const [expenses]: any = await db.execute(
      'SELECT e.*, c.name as category_name, c.color as category_color FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY e.expense_date DESC',
      [userId]
    );

    const monthlyExpenses = (expenses || []).filter((e: any) => e.expense_date.startsWith(currentMonth));

    const totalSpend = monthlyExpenses.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

    // Calculate category percentages
    const categoryMap: { [key: string]: number } = {};
    monthlyExpenses.forEach((e: any) => {
      const catName = e.category_name || 'General / Other';
      categoryMap[catName] = (categoryMap[catName] || 0) + Number(e.amount);
    });

    const categoryBreakdown = Object.keys(categoryMap).map(catName => ({
      name: catName,
      amount: categoryMap[catName],
      percentage: totalSpend > 0 ? (categoryMap[catName] / totalSpend) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    const topExpenses = monthlyExpenses.slice(0, 5);

    // Send email using Nodemailer service
    const emailResult = await sendMonthlyReportEmail({
      userEmail,
      userName: username,
      monthYear: currentMonth,
      totalSpend,
      totalExpensesCount: monthlyExpenses.length,
      categoryBreakdown,
      topExpenses
    });

    return res.json({
      success: emailResult.success,
      message: emailResult.message,
      previewUrl: emailResult.previewUrl,
      reportSummary: {
        userEmail,
        monthYear: currentMonth,
        totalSpend,
        totalExpensesCount: monthlyExpenses.length,
        categoryBreakdown,
        topExpenses
      }
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate and dispatch monthly report.' });
  }
};

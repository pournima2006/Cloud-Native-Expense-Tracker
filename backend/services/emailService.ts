import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export interface EmailReportData {
  userEmail: string;
  userName: string;
  monthYear: string;
  totalSpend: number;
  totalExpensesCount: number;
  categoryBreakdown: Array<{ name: string; amount: number; percentage: number }>;
  topExpenses: Array<{ merchant_name: string; amount: number; date: string; category_name: string }>;
}

export async function sendMonthlyReportEmail(report: EmailReportData): Promise<{ success: boolean; previewUrl?: string; message: string }> {
  // Build HTML email body
  const categoryRows = report.categoryBreakdown.map(c => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: 500;">${c.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; text-align: right;">$${c.amount.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; text-align: right;">${c.percentage.toFixed(1)}%</td>
    </tr>
  `).join('');

  const expenseRows = report.topExpenses.map(e => `
    <tr>
      <td style="padding: 8px 10px; border-bottom: 1px solid #F3F4F6;">${e.merchant_name}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #F3F4F6; color: #6B7280; font-size: 13px;">${e.category_name}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #F3F4F6; color: #6B7280; font-size: 13px;">${e.date}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #F3F4F6; text-align: right; font-weight: 600; color: #1F2937;">$${e.amount.toFixed(2)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: #4F46E5; color: #FFFFFF; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 24px; }
        .stat-grid { display: flex; gap: 12px; margin-bottom: 24px; }
        .stat-card { flex: 1; background: #F3F4F6; border-radius: 8px; padding: 16px; text-align: center; }
        .stat-val { font-size: 22px; font-weight: 700; color: #111827; }
        .stat-lbl { font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { text-align: left; padding: 8px 10px; background: #F9FAFB; color: #4B5563; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; }
        .section-title { font-size: 16px; font-weight: 600; margin: 24px 0 12px 0; color: #111827; }
        .footer { text-align: center; padding: 16px; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Monthly Financial Summary</h1>
          <p>${report.monthYear} Report for ${report.userName}</p>
        </div>
        <div class="content">
          <div style="margin-bottom: 20px;">
            <p style="margin: 0; font-size: 15px; color: #374151;">Hello ${report.userName},</p>
            <p style="margin: 6px 0 0 0; font-size: 14px; color: #6B7280;">Here is your automated monthly expense breakdown and analytics overview.</p>
          </div>

          <div style="background-color: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 13px; color: #4338CA; font-weight: 600; text-transform: uppercase;">Total Monthly Spend</div>
            <div style="font-size: 32px; font-weight: 800; color: #312E81; margin-top: 4px;">$${report.totalSpend.toFixed(2)}</div>
            <div style="font-size: 13px; color: #6366F1; margin-top: 2px;">Across ${report.totalExpensesCount} total transactions</div>
          </div>

          <div class="section-title">Spending by Category</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: right;">Share</th>
              </tr>
            </thead>
            <tbody>
              ${categoryRows}
            </tbody>
          </table>

          <div class="section-title">Top Recent Expenses</div>
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th>Date</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows}
            </tbody>
          </table>
        </div>
        <div class="footer">
          Generated automatically by Expense Tracker & OCR Receipt Scanner.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    let transporter: nodemailer.Transporter;

    if (env.SMTP_HOST && env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      // Create a test account using Ethereal
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `"Expense Tracker System" <${env.SMTP_FROM}>`,
      to: report.userEmail,
      subject: `Monthly Expense Report - ${report.monthYear} ($${report.totalSpend.toFixed(2)})`,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

    return {
      success: true,
      previewUrl,
      message: `Report successfully dispatched to ${report.userEmail}${previewUrl ? ' (Ethereal test preview available)' : ''}`,
    };
  } catch (err: any) {
    console.error('Email report error:', err);
    return {
      success: false,
      message: `Failed to dispatch email: ${err.message || 'SMTP error'}`
    };
  }
}

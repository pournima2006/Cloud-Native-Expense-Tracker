export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

export interface Category {
  id: number;
  user_id: number | null;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: number;
  user_id: number;
  category_id: number;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  merchant_name: string;
  amount: number;
  expense_date: string;
  notes?: string;
  receipt_url?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  raw_ocr_text?: string | null;
  created_at?: string;
}

export interface OCRResult {
  merchantName: string;
  amount: number;
  date: string;
  category?: string;
  categoryName: string;
  categoryId: number;
  confidence: number;
  receiptUrl: string;
  imageUrl?: string;
  rawText?: string;
  lineItems?: Array<{ description: string; price: number }>;
}

export interface AnalyticsSummary {
  totalSpend: number;
  totalTransactions: number;
  averageExpense: number;
  categoryBreakdown: Array<{
    name: string;
    amount: number;
    color: string;
    icon: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
  recentTransactions: Expense[];
}

export interface ReportSummary {
  userEmail: string;
  monthYear: string;
  totalSpend: number;
  totalExpensesCount: number;
  categoryBreakdown: Array<{ name: string; amount: number; percentage: number }>;
  topExpenses: Expense[];
}

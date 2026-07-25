import React, { useEffect, useState } from 'react';
import { AnalyticsSummary, Expense, Category } from '../types';
import { expenseAPI } from '../services/api';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { ExpenseCard } from '../components/ExpenseCard';
import { DollarSign, TrendingUp, CreditCard, Scan, ArrowUpRight, Loader2, RefreshCw, Upload, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  onOpenUpload: () => void;
  categories: Category[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenUpload,
  categories,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await expenseAPI.getAnalytics();
      if (res.success) {
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#666666] font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D8D8E] mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">Loading Analytics...</span>
      </div>
    );
  }

  const totalSpend = summary?.totalSpend ?? 0;
  const totalTx = summary?.totalTransactions ?? 0;
  const avgExpense = summary?.averageExpense ?? 0;

  return (
    <div className="space-y-6">
      
      {/* Top 4 Bento Stat Grid */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Bento Stat 1: Primary Accent Total Expenses Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#5D8D8E] p-5 rounded-3xl text-[#F8F6F2] flex flex-col justify-between shadow-taupe border border-[#5D8D8E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F8F6F2]/80">Total Portfolio Spend</span>
            <span className="text-[10px] font-bold text-[#2D2D2D] bg-[#F8F6F2] px-2 py-0.5 rounded-full">Live</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-black tracking-tight text-[#F8F6F2]">${totalSpend.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-[#F8F6F2]/80 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#F8F6F2]/80" />
            <span>Cumulative recorded expenses</span>
          </p>
        </div>

        {/* Bento Stat 2: Secondary Accent Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#CDC8C0] dark:bg-[#242830] p-5 rounded-3xl border border-[#DDD8D0] dark:border-[#333842] text-[#2D2D2D] dark:text-[#F8F6F2] flex flex-col justify-between shadow-taupe">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#2D2D2D]/70 dark:text-[#A0AEC0] font-semibold uppercase tracking-wider">Transactions Logged</span>
            <span className="text-[10px] font-bold text-[#F8F6F2] bg-[#5D8D8E] px-2 py-0.5 rounded-full">
              {totalTx} Items
            </span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">{totalTx} Receipts</span>
          </div>
          <p className="text-[11px] text-[#2D2D2D]/70 dark:text-[#A0AEC0] flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-[#2D2D2D]/70 dark:text-[#A0AEC0]" />
            <span>Verified with OCR</span>
          </p>
        </div>

        {/* Bento Stat 3: Cool Cream Background Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] text-[#2D2D2D] dark:text-[#F8F6F2] flex flex-col justify-between shadow-taupe">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#666666] dark:text-[#A0AEC0] font-semibold uppercase tracking-wider">Average Ticket</span>
            <span className="text-[10px] font-bold text-[#2D2D2D] dark:text-[#F8F6F2] bg-[#CDC8C0] dark:bg-[#2E343D] px-2 py-0.5 rounded-full">
              Mean
            </span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">${avgExpense.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-[#666666] dark:text-[#A0AEC0] flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#5D8D8E] dark:text-[#79B4B5]" />
            <span>Per transaction average</span>
          </p>
        </div>

        {/* Bento Stat 4 - Primary Action Bento Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#5D8D8E] p-5 rounded-3xl text-[#F8F6F2] flex flex-col justify-between shadow-taupe">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F8F6F2]/80 uppercase tracking-wider">Quick Action</span>
            <ShieldCheck className="w-4 h-4 text-[#79B4B5]" />
          </div>
          <div className="my-2">
            <p className="font-extrabold text-base leading-snug">Instant OCR Scanner</p>
            <p className="text-[11px] text-[#F8F6F2]/80 mt-0.5">Upload receipt image to auto-fill</p>
          </div>
          <button
            onClick={onOpenUpload}
            className="w-full bg-[#F8F6F2] hover:bg-[#E8E4DD] text-[#2D2D2D] font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Scan Receipt Now</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#5D8D8E]" />
          </button>
        </div>

      </div>

      {/* Middle Row Bento Grid */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Left Bento Box - Analytics Charts */}
        <div className="col-span-12 lg:col-span-8 bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-base">Expense Breakdowns</h3>
              <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">Distribution across categories & spending timeline</p>
            </div>
            <button
              onClick={fetchAnalytics}
              className="p-2 text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2A2E35] rounded-xl transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {summary && <AnalyticsCharts summary={summary} />}
        </div>

        {/* Right Bento Box - OCR Drop & Scanner Callout */}
        <div
          onClick={onOpenUpload}
          className="col-span-12 lg:col-span-4 bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border-2 border-dashed border-[#5D8D8E]/50 dark:border-[#5D8D8E]/70 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#5D8D8E] hover:bg-[#CDC8C0]/20 dark:hover:bg-[#282C34] transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Scan className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-base">Scan New Receipt</h3>
            <p className="text-xs text-[#666666] dark:text-[#A0AEC0] mt-1 max-w-xs">
              Drag & drop bill receipts or invoices to auto-extract amount, merchant, and date with Tesseract.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Receipt Image</span>
          </button>
        </div>

      </div>

      {/* Bottom Row Bento Box - Recent Transactions */}
      <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-base">Recent Activity Logs</h3>
            <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">Latest expense entries recorded in database</p>
          </div>
        </div>

        {summary && summary.recentTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.recentTransactions.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[#666666] text-xs">
            No transactions recorded yet. Click "Scan Receipt Now" to add your first expense.
          </div>
        )}
      </div>

    </div>
  );
};

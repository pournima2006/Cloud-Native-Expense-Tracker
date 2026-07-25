import React from 'react';
import { AnalyticsSummary } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DollarSign, CreditCard, TrendingUp, Tag } from 'lucide-react';

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ summary }) => {
  // Cool Minimalist chart palette: Segment A = Calm Teal (#5D8D8E), Segment B = Highlight Teal (#79B4B5)
  const chartColors = ['#5D8D8E', '#79B4B5', '#CDC8C0', '#4A7374', '#93C4C5', '#9E978C'];

  const pieData = summary.categoryBreakdown.map((c, index) => ({
    name: c.name,
    value: c.amount,
    color: chartColors[index % chartColors.length],
  }));

  const barData = summary.monthlyTrend.map((m) => ({
    month: m.month,
    Spend: m.amount,
  }));

  const topCategory = summary.categoryBreakdown[0];

  return (
    <div className="space-y-6">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] dark:text-[#A0AEC0] uppercase tracking-wider">Total Spending</p>
            <h3 className="text-xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] mt-0.5">${summary.totalSpend.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#79B4B5]/20 text-[#2D2D2D] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-[#5D8D8E] dark:text-[#79B4B5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] dark:text-[#A0AEC0] uppercase tracking-wider">Transactions</p>
            <h3 className="text-xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] mt-0.5">{summary.totalTransactions}</h3>
          </div>
        </div>

        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#CDC8C0]/50 dark:bg-[#2A2E35] text-[#2D2D2D] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-[#5D8D8E] dark:text-[#79B4B5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] dark:text-[#A0AEC0] uppercase tracking-wider">Avg Transaction</p>
            <h3 className="text-xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] mt-0.5">${summary.averageExpense.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#CDC8C0] dark:bg-[#2A2E35] text-[#2D2D2D] flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-[#2D2D2D] dark:text-[#F8F6F2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] dark:text-[#A0AEC0] uppercase tracking-wider">Top Category</p>
            <h3 className="text-sm font-bold text-[#2D2D2D] dark:text-[#F8F6F2] mt-0.5 line-clamp-1">{topCategory ? topCategory.name : 'N/A'}</h3>
            {topCategory && (
              <span className="text-[11px] text-[#666666] dark:text-[#A0AEC0]">${topCategory.amount.toFixed(2)}</span>
            )}
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Donut */}
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm">Category Breakdown</h3>
            <p className="text-[11px] text-[#666666] dark:text-[#A0AEC0]">Expense distribution across categories</p>
          </div>

          {pieData.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Amount']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', color: '#2D2D2D' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-[#666666]">
              No expense data recorded yet.
            </div>
          )}
        </div>

        {/* Monthly Trend Bar Chart */}
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm">Monthly Spend Trend</h3>
            <p className="text-[11px] text-[#666666] dark:text-[#A0AEC0]">Timeline comparison of expense volume</p>
          </div>

          {barData.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#2D2D2D' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#2D2D2D' }} />
                  <Tooltip formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Spend']} />
                  <Bar dataKey="Spend" fill="#5D8D8E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-[#666666]">
              No historical trend available.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { reportAPI } from '../services/api';
import { Mail, Send, Loader2, CheckCircle, ExternalLink, Calendar, FileSpreadsheet, Sparkles } from 'lucide-react';

interface ReportsProps {
  userEmail: string;
}

export const Reports: React.FC<ReportsProps> = ({ userEmail }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [isSending, setIsSending] = useState(false);
  const [reportResult, setReportResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendReport = async () => {
    setIsSending(true);
    setError(null);
    setReportResult(null);

    try {
      const res = await reportAPI.sendMonthlyReport(selectedMonth);
      if (res.success) {
        setReportResult(res);
      } else {
        setError(res.message || 'Failed to dispatch report.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate monthly email report.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 sm:p-8 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe">
        <div className="inline-flex items-center gap-1.5 bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Automated Email Service (Nodemailer)</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">Monthly Financial Email Reports</h1>
        <p className="mt-1 text-xs text-[#666666] dark:text-[#A0AEC0] max-w-xl">
          Compile monthly financial analytics, spending category breakdown, and top transactions into a formatted HTML report sent directly to your email address.
        </p>
      </div>

      {/* Control Card */}
      <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-2">Recipient Email Address</label>
            <div className="flex items-center gap-2 p-3 bg-[#CDC8C0]/30 dark:bg-[#2A2E35] border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-sm font-medium text-[#2D2D2D] dark:text-[#F8F6F2]">
              <Mail className="w-4 h-4 text-[#5D8D8E] dark:text-[#79B4B5]" />
              <span>{userEmail || 'user@example.com'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-2">Select Report Period (Month)</label>
            <div className="relative">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2.5 border border-[#DDD8D0] dark:border-[#2D323A] bg-[#F8F6F2] dark:bg-[#121417] rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] text-[#2D2D2D] dark:text-[#F8F6F2]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Dispatch Action */}
        <div className="pt-4 border-t border-[#DDD8D0] dark:border-[#2D323A] flex items-center justify-between">
          <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">
            Sends an HTML email summary with category breakdown charts and totals.
          </p>
          <button
            onClick={handleSendReport}
            disabled={isSending}
            className="bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F8F6F2]" />
                <span>Compiling & Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Monthly Report Email</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Result & Ethereal Preview Card */}
      {reportResult && (
        <div className="bg-[#5D8D8E]/10 dark:bg-[#5D8D8E]/20 border border-[#5D8D8E]/30 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5D8D8E] text-[#F8F6F2] flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-base">Report Dispatched Successfully</h3>
              <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">{reportResult.message}</p>
            </div>
          </div>

          {reportResult.reportSummary && (
            <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-4 rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] space-y-3 text-xs">
              <div className="flex justify-between font-bold border-b border-[#DDD8D0] dark:border-[#2D323A] pb-2 text-[#2D2D2D] dark:text-[#F8F6F2]">
                <span>Month: {reportResult.reportSummary.monthYear}</span>
                <span>Total Spend: ${reportResult.reportSummary.totalSpend.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-semibold text-[#2D2D2D] dark:text-[#F8F6F2]">Transactions: </span>
                <span className="text-[#666666] dark:text-[#A0AEC0]">{reportResult.reportSummary.totalExpensesCount} total</span>
              </div>
            </div>
          )}

          {reportResult.previewUrl && (
            <div className="pt-2">
              <a
                href={reportResult.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#5D8D8E] bg-[#F8F6F2] px-4 py-2.5 rounded-xl border border-[#DDD8D0] hover:bg-[#CDC8C0]/30 shadow-xs"
              >
                <span>View Live Ethereal Email Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

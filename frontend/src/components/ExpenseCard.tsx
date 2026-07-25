import React, { useState } from 'react';
import { Expense } from '../types';
import { Utensils, Car, Zap, ShoppingBag, Film, HeartPulse, Plane, Tag, FileText, Trash2, Edit2, Image, ExternalLink, PenTool } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

const iconMap: { [key: string]: any } = {
  Utensils,
  Car,
  Zap,
  ShoppingBag,
  Film,
  HeartPulse,
  Plane,
  Tag,
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const IconComponent = iconMap[expense.category_icon || 'Tag'] || Tag;
  const receiptUrl = expense.image_url || expense.imageUrl || expense.receipt_url;

  return (
    <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] p-5 shadow-taupe hover:border-[#CDC8C0] dark:hover:border-[#3D4450] transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#F8F6F2] shrink-0 shadow-xs"
              style={{ backgroundColor: expense.category_color || '#5D8D8E' }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm line-clamp-1">{expense.merchant_name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CDC8C0] dark:bg-[#2A2E35] text-[#2D2D2D] dark:text-[#E2E8F0]">
                  {expense.category_name || 'General'}
                </span>
                {receiptUrl ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] border border-[#5D8D8E]/20" title="Scanned via OCR">
                    <FileText className="w-3 h-3" />
                    <span>OCR Scan</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#CDC8C0]/40 dark:bg-[#2A2E35] text-[#666666] dark:text-[#A0AEC0]" title="Manually entered expense">
                    <PenTool className="w-3 h-3" />
                    <span>Manual</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base font-black text-[#2D2D2D] dark:text-[#F8F6F2] block">₹{Number(expense.amount).toFixed(2)}</span>
            <span className="text-[10px] text-[#666666] dark:text-[#A0AEC0] font-medium">{expense.expense_date}</span>
          </div>
        </div>

        {/* Notes */}
        {expense.notes && (
          <p className="text-xs text-[#666666] dark:text-[#CBD5E1] bg-[#E8E4DD] dark:bg-[#242830] p-2.5 rounded-xl mb-3 line-clamp-2 italic border border-[#DDD8D0] dark:border-[#333842]">
            "{expense.notes}"
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#DDD8D0] dark:border-[#2D323A] flex items-center justify-between text-xs text-[#666666] dark:text-[#A0AEC0]">
        <div className="flex items-center gap-2">
          {receiptUrl ? (
            <button
              onClick={() => setShowReceipt(!showReceipt)}
              className="flex items-center gap-1 text-[#5D8D8E] dark:text-[#79B4B5] hover:text-[#4A7374] font-bold cursor-pointer text-[11px] bg-[#5D8D8E]/10 px-2.5 py-1 rounded-lg border border-[#5D8D8E]/20"
            >
              <Image className="w-3.5 h-3.5" />
              <span>View Receipt</span>
            </button>
          ) : (
            <span className="text-[11px] text-[#666666]/70 dark:text-[#A0AEC0]/70 italic">No image attached</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2A2E35] rounded-lg text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1.5 hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2A2E35] rounded-lg text-[#666666] dark:text-[#A0AEC0] hover:text-red-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptUrl && (
        <div className="fixed inset-0 bg-[#2D2D2D]/60 dark:bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] rounded-2xl max-w-lg w-full p-5 overflow-hidden shadow-2xl relative border border-[#DDD8D0] dark:border-[#2D323A]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#DDD8D0] dark:border-[#2D323A]">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-[#5D8D8E] dark:text-[#79B4B5]" />
                <h4 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm">Receipt Image ({expense.merchant_name})</h4>
              </div>
              <div className="flex items-center gap-2">
                {receiptUrl.startsWith('http') && (
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#5D8D8E] dark:text-[#79B4B5] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] font-bold px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-auto flex justify-center bg-[#2D2D2D] rounded-lg p-2">
              <img src={receiptUrl} alt="Receipt" className="max-w-full max-h-[60vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

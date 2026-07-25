import React, { useState } from 'react';
import { Category } from '../types';
import { UploadModal } from '../components/UploadModal';
import { Scan, UploadCloud, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface ReceiptsProps {
  categories: Category[];
  onExpenseCreated: () => void;
  onOpenUpload: () => void;
}

export const Receipts: React.FC<ReceiptsProps> = ({ categories, onExpenseCreated, onOpenUpload }) => {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 sm:p-8 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tesseract.js OCR Powered</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">Receipt Image Scanner</h1>
          <p className="mt-1 text-xs text-[#666666] dark:text-[#A0AEC0] max-w-lg">
            Upload paper bill receipts or invoice images. The optical character recognition engine automatically extracts store name, total, date, and items.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Scan className="w-5 h-5" />
          <span>Launch OCR Scanner</span>
        </button>
      </div>

      {/* Feature Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe">
          <div className="w-12 h-12 rounded-2xl bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] flex items-center justify-center mb-4">
            <Scan className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm">Automated Tesseract Scan</h3>
          <p className="text-xs text-[#666666] dark:text-[#A0AEC0] mt-1.5 leading-relaxed">
            Extract Total Amount, Merchant Name, Category, and Date in seconds without manual keying.
          </p>
        </div>

        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe">
          <div className="w-12 h-12 rounded-2xl bg-[#79B4B5]/20 text-[#5D8D8E] dark:text-[#79B4B5] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm">Smart Auto-Categorization</h3>
          <p className="text-xs text-[#666666] dark:text-[#A0AEC0] mt-1.5 leading-relaxed">
            Assigns transactions to Food, Travel, Transport, Utilities, or Shopping automatically.
          </p>
        </div>

        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe">
          <div className="w-12 h-12 rounded-2xl bg-[#CDC8C0] dark:bg-[#2A2E35] text-[#2D2D2D] dark:text-[#F8F6F2] flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-[#2D2D2D] dark:text-[#F8F6F2]" />
          </div>
          <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-sm">Digital Document Vault</h3>
          <p className="text-xs text-[#666666] dark:text-[#A0AEC0] mt-1.5 leading-relaxed">
            High-resolution receipt scans and raw text strings stored safely alongside every transaction.
          </p>
        </div>

      </div>

      {/* OCR Scanner Launch Banner */}
      <div
        onClick={onOpenUpload}
        className="border-2 border-dashed border-[#5D8D8E]/40 dark:border-[#5D8D8E]/70 hover:border-[#5D8D8E] bg-[#CDC8C0]/20 dark:bg-[#1C1F24] hover:bg-[#CDC8C0]/40 dark:hover:bg-[#252830] rounded-3xl p-10 text-center cursor-pointer transition-all group"
      >
        <div className="w-16 h-16 rounded-full bg-[#5D8D8E] text-[#F8F6F2] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#2D2D2D] dark:text-[#F8F6F2]">Upload Receipt to Start OCR</h2>
        <p className="text-xs text-[#666666] dark:text-[#A0AEC0] mt-1 max-w-md mx-auto">
          Click anywhere in this zone or press "Launch OCR Scanner" to select an image file from your device.
        </p>
      </div>

    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Category, OCRResult } from '../types';
import { ocrAPI, expenseAPI } from '../services/api';
import {
  PenTool,
  Scan,
  UploadCloud,
  Loader2,
  Sparkles,
  Check,
  AlertCircle,
  X,
  FileText,
  DollarSign,
  Calendar,
  Tag,
  AlignLeft,
} from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onExpenseCreated: () => void;
  initialTab?: 'manual' | 'scan';
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  onExpenseCreated,
  initialTab = 'manual',
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'scan'>(initialTab);

  // Form states
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // OCR Scan states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  // Status & loading
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    runOCRScan(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const runOCRScan = async (file: File) => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await ocrAPI.scanReceipt(file);
      if (res.success && res.extractedData) {
        const data = res.extractedData;
        setOcrResult(data);
        setMerchantName(data.merchantName || '');
        setAmount(data.amount ? String(data.amount) : '');
        if (data.date) setExpenseDate(data.date);
        if (data.categoryId) setCategoryId(data.categoryId);
      }
    } catch (err: any) {
      console.error('OCR scan error:', err);
      setError('Receipt scanning encountered an error. You can still review and submit the expense details manually.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName || !amount || !expenseDate) {
      setError('Merchant name, amount, and date are required.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (expenseDate > todayStr) {
      setError('Transaction date cannot be in the future.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const isScanTab = activeTab === 'scan';
      const finalImageUrl = isScanTab ? (ocrResult?.imageUrl || ocrResult?.receiptUrl || previewUrl || null) : null;

      await expenseAPI.create({
        category_id: Number(categoryId),
        merchant_name: merchantName,
        amount: parseFloat(amount),
        expense_date: expenseDate,
        notes: notes || '',
        image_url: finalImageUrl,
        imageUrl: finalImageUrl,
        receipt_url: finalImageUrl,
        raw_ocr_text: isScanTab ? (ocrResult?.rawText || '') : null,
      });

      onExpenseCreated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOcrResult(null);
    setError(null);
    setMerchantName('');
    setAmount('');
    setNotes('');
    setActiveTab(initialTab);
    onClose();
  };

  const todayDateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-[#2D2D2D]/60 dark:bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] rounded-3xl max-w-xl w-full p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#DDD8D0] dark:border-[#2D323A]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD8D0] dark:border-[#2D323A]">
          <div>
            <h2 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-lg">Add New Expense</h2>
            <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">Record a new transaction manually or scan a receipt</p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] font-bold p-1.5 rounded-xl hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2D323A] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs */}
        <div className="mt-4 p-1 bg-[#CDC8C0]/40 dark:bg-[#2A2E35] rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              setError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-[#5D8D8E] text-[#F8F6F2] shadow-xs'
                : 'text-[#2D2D2D] dark:text-[#CBD5E1] hover:bg-[#CDC8C0]/60 dark:hover:bg-[#333842]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('scan');
              setError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-[#5D8D8E] text-[#F8F6F2] shadow-xs'
                : 'text-[#2D2D2D] dark:text-[#CBD5E1] hover:bg-[#CDC8C0]/60 dark:hover:bg-[#333842]'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan Receipt (S3 + OCR)</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 2: OCR Scanner Zone (Only when Scan Tab active) */}
        {activeTab === 'scan' && (
          <div className="mt-4">
            {!selectedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#5D8D8E]/40 hover:border-[#5D8D8E] bg-[#CDC8C0]/20 hover:bg-[#CDC8C0]/40 rounded-2xl p-6 text-center cursor-pointer transition-all"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-[#5D8D8E]/15 text-[#5D8D8E] flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#2D2D2D]">Drop receipt image here or click to browse</p>
                <p className="text-[11px] text-[#666666] mt-0.5">Automated S3 upload & Tesseract.js text extraction</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#CDC8C0]/20 p-3 rounded-2xl border border-[#DDD8D0]">
                <div className="sm:col-span-1 flex flex-col items-center justify-center bg-[#2D2D2D] rounded-xl p-2 relative min-h-[120px]">
                  {previewUrl && (
                    <img src={previewUrl} alt="Receipt Preview" className="max-h-36 object-contain rounded-lg" />
                  )}
                  {isScanning && (
                    <div className="absolute inset-0 bg-[#2D2D2D]/80 rounded-xl flex flex-col items-center justify-center text-[#F8F6F2] p-2 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-[#79B4B5] mb-1" />
                      <span className="text-[11px] font-bold">Scanning OCR...</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 flex flex-col justify-center text-xs space-y-1">
                  {isScanning ? (
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-[#CDC8C0] rounded animate-pulse w-3/4"></div>
                      <div className="h-3.5 bg-[#CDC8C0] rounded animate-pulse w-1/2"></div>
                    </div>
                  ) : ocrResult ? (
                    <div>
                      <div className="flex items-center gap-1.5 text-[#5D8D8E] font-bold mb-1">
                        <Check className="w-4 h-4" />
                        <span>OCR Parsed & Uploaded to AWS S3</span>
                      </div>
                      <p className="text-[#666666] text-[11px]">
                        <span className="font-bold text-[#2D2D2D]">Store:</span> {ocrResult.merchantName}
                      </p>
                      <p className="text-[#666666] text-[11px]">
                        <span className="font-bold text-[#2D2D2D]">Total:</span> ₹{ocrResult.amount.toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1.5 text-[#5D8D8E] hover:underline font-bold text-[11px] block cursor-pointer"
                      >
                        Change Image
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        accept="image/*,.pdf"
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <span className="text-[#666666] text-[11px]">Image attached. Verify pre-filled details below.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expense Form Inputs */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Merchant / Store Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Starbucks, Amazon"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
                <FileText className="w-3.5 h-3.5 text-[#666666] dark:text-[#A0AEC0] absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Total Amount (₹) *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
                <span className="w-3.5 h-3.5 text-[#666666] dark:text-[#A0AEC0] absolute left-2.5 top-2 text-xs font-bold pointer-events-none">₹</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Category *</label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-[#1C1F24] text-[#2D2D2D] dark:text-[#F8F6F2] py-1">
                      {c.name}
                    </option>
                  ))}
                </select>
                <Tag className="w-3.5 h-3.5 text-[#666666] dark:text-[#A0AEC0] absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Transaction Date *</label>
              <div className="relative">
                <input
                  type="date"
                  value={expenseDate}
                  max={todayDateStr}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
                <Calendar className="w-3.5 h-3.5 text-[#666666] dark:text-[#A0AEC0] absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Notes / Memo (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Client dinner, Monthly subscription"
                className="w-full pl-8 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
              />
              <AlignLeft className="w-3.5 h-3.5 text-[#666666] dark:text-[#A0AEC0] absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-3 border-t border-[#DDD8D0] dark:border-[#2D323A] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs font-semibold text-[#666666] dark:text-[#A0AEC0] hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2D323A] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isScanning}
              className="px-5 py-2 bg-[#5D8D8E] hover:bg-[#4A7374] disabled:opacity-50 text-[#F8F6F2] rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F8F6F2]" />}
              <span>{activeTab === 'manual' ? 'Save Manual Expense' : 'Save Scanned Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

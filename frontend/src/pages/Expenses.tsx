import React, { useEffect, useState } from 'react';
import { Expense, Category } from '../types';
import { expenseAPI } from '../services/api';
import { ExpenseCard } from '../components/ExpenseCard';
import { Search, Filter, Plus, Loader2, LayoutGrid, List, Trash2, Edit2, Calendar, PenTool, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface ExpensesProps {
  categories: Category[];
  onOpenUpload: () => void;
  refreshTrigger: number;
}

export const Expenses: React.FC<ExpensesProps> = ({ categories, onOpenUpload, refreshTrigger }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Edit / Manual Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form State
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await expenseAPI.getAll({
        category_id: selectedCategory ? Number(selectedCategory) : undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        search: search || undefined,
      });
      if (res.success) {
        setExpenses(res.expenses);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, startDate, endDate, search, refreshTrigger]);

  const handleOpenCreateModal = () => {
    setEditingExpense(null);
    setMerchantName('');
    setAmount('');
    setCategoryId(categories[0]?.id || 1);
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setMerchantName(expense.merchant_name);
    setAmount(String(expense.amount));
    setCategoryId(expense.category_id);
    setExpenseDate(expense.expense_date);
    setNotes(expense.notes || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await expenseAPI.delete(id);
      fetchExpenses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense.');
    }
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName || !amount || !expenseDate) return;

    const todayStr = new Date().toISOString().split('T')[0];
    if (expenseDate > todayStr) {
      alert('Transaction date cannot be in the future.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingExpense) {
        await expenseAPI.update(editingExpense.id, {
          category_id: categoryId,
          merchant_name: merchantName,
          amount: parseFloat(amount),
          expense_date: expenseDate,
          notes,
        });
      } else {
        await expenseAPI.create({
          category_id: categoryId,
          merchant_name: merchantName,
          amount: parseFloat(amount),
          expense_date: expenseDate,
          notes,
        });
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err: any) {
      alert(err.message || 'Error saving expense.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalFilteredSpend = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">Expense Management</h1>
          <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">View, search, filter, and manually edit expense records</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Bento Box */}
      <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-5 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search keyword */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchant or notes..."
              className="w-full pl-9 pr-3 py-2.5 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
            />
            <Search className="w-4 h-4 text-[#666666] dark:text-[#A0AEC0] absolute left-3 top-3" />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2.5 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
            >
              <option value="" className="bg-white dark:bg-[#1C1F24] text-[#2D2D2D] dark:text-[#F8F6F2] py-1">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-[#1C1F24] text-[#2D2D2D] dark:text-[#F8F6F2] py-1">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date range start */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
            />
          </div>

          {/* Date range end */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
            />
          </div>

        </div>

        {/* View Mode & Totals */}
        <div className="flex items-center justify-between pt-3 border-t border-[#DDD8D0] dark:border-[#2D323A] text-xs">
          <div className="text-[#666666] dark:text-[#A0AEC0] font-semibold">
            <span>Filtered Total: </span>
            <span className="text-[#5D8D8E] dark:text-[#79B4B5] font-extrabold text-sm">₹{totalFilteredSpend.toFixed(2)}</span>
            <span className="text-[#666666] dark:text-[#A0AEC0] font-normal ml-2">({expenses.length} records)</span>
          </div>

          <div className="flex items-center gap-1 bg-[#CDC8C0]/40 dark:bg-[#2A2E35] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#F8F6F2] dark:bg-[#1C1F24] shadow-xs text-[#5D8D8E] dark:text-[#79B4B5]' : 'text-[#666666] dark:text-[#A0AEC0]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#F8F6F2] dark:bg-[#1C1F24] shadow-xs text-[#5D8D8E] dark:text-[#79B4B5]' : 'text-[#666666] dark:text-[#A0AEC0]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expense List Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
          <span className="text-xs font-medium">Fetching expense records...</span>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] p-12 text-center">
          <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F6F2]">No matching expenses found.</p>
          <p className="text-xs text-[#666666] dark:text-[#A0AEC0] mt-1">Try resetting filters or scan a new receipt.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] rounded-2xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#CDC8C0]/30 dark:bg-[#2A2E35] text-[#666666] dark:text-[#A0AEC0] font-semibold uppercase border-b border-[#DDD8D0] dark:border-[#2D323A]">
              <tr>
                <th className="p-3">Source</th>
                <th className="p-3">Merchant</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Receipt Image</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8D0] dark:divide-[#2D323A] font-medium text-[#2D2D2D] dark:text-[#CBD5E1]">
              {expenses.map((e) => {
                const imgUrl = e.image_url || e.imageUrl || e.receipt_url;
                return (
                  <tr key={e.id} className="hover:bg-[#CDC8C0]/20 dark:hover:bg-[#252830] transition-colors">
                    <td className="p-3">
                      {imgUrl ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] border border-[#5D8D8E]/20">
                          <FileText className="w-3 h-3" />
                          <span>OCR</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#CDC8C0]/40 dark:bg-[#2A2E35] text-[#666666] dark:text-[#A0AEC0]">
                          <PenTool className="w-3 h-3" />
                          <span>Manual</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-[#2D2D2D] dark:text-[#F8F6F2]">{e.merchant_name}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#CDC8C0] dark:bg-[#2A2E35] text-[#2D2D2D] dark:text-[#E2E8F0]">
                        {e.category_name || 'General'}
                      </span>
                    </td>
                    <td className="p-3 text-[#666666] dark:text-[#A0AEC0]">{e.expense_date}</td>
                    <td className="p-3">
                      {imgUrl ? (
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#5D8D8E] dark:text-[#79B4B5] hover:underline text-[11px] font-semibold bg-[#5D8D8E]/10 px-2 py-0.5 rounded border border-[#5D8D8E]/20"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>S3 Receipt</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#666666]/70 dark:text-[#A0AEC0]/70 italic">None</span>
                      )}
                    </td>
                    <td className="p-3 text-[#666666] dark:text-[#A0AEC0] max-w-xs truncate">{e.notes || '-'}</td>
                    <td className="p-3 text-right font-bold text-[#2D2D2D] dark:text-[#F8F6F2]">₹{Number(e.amount).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(e)}
                          className="p-1 hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2A2E35] text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] rounded cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="p-1 hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2A2E35] text-[#666666] dark:text-[#A0AEC0] hover:text-red-600 dark:hover:text-rose-400 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D2D2D]/60 dark:bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#DDD8D0] dark:border-[#2D323A] my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#DDD8D0] dark:border-[#2D323A]">
              <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-base">
                {editingExpense ? 'Edit Expense Record' : 'Add New Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] font-bold p-1 rounded-lg hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2D323A] cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Merchant / Store Name *</label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Starbucks"
                  required
                  className="w-full px-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full px-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-[#1C1F24] text-[#2D2D2D] dark:text-[#F8F6F2] py-1">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Transaction Date *</label>
                <input
                  type="date"
                  value={expenseDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                  className="w-full px-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E] bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2]"
                />
              </div>

              <div className="pt-4 border-t border-[#DDD8D0] dark:border-[#2D323A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-xl font-semibold text-[#666666] dark:text-[#A0AEC0] hover:bg-[#CDC8C0]/40 dark:hover:bg-[#2D323A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {isSaving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

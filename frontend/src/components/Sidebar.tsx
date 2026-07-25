import React from 'react';
import { LayoutDashboard, ReceiptText, Scan, FileSpreadsheet, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Transactions', icon: ReceiptText },
    { id: 'receipts', label: 'Receipt OCR', icon: Scan },
    { id: 'reports', label: 'Analytics', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#F8F6F2] dark:bg-[#181A1D] border-r border-[#DDD8D0] dark:border-[#2A2E35] flex flex-col p-6 space-y-8 shrink-0 md:min-h-screen transition-colors">
      
      {/* Brand Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 bg-[#5D8D8E] rounded-xl flex items-center justify-center text-[#F8F6F2] shadow-xs shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-[#2D2D2D] dark:text-[#F8F6F2]">Expense Tracker</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        <p className="px-1 text-[10px] font-bold text-[#666666] dark:text-[#A0AEC0] uppercase tracking-wider mb-2">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#5D8D8E] text-[#F8F6F2] font-semibold shadow-xs'
                  : 'text-[#2D2D2D] dark:text-[#CBD5E1] hover:bg-[#E8E4DD] dark:hover:bg-[#252830] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#F8F6F2]' : 'text-[#5D8D8E] dark:text-[#79B4B5]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Plan / OCR Status Card */}
      <div className="bg-[#CDC8C0] dark:bg-[#242830] text-[#2D2D2D] dark:text-[#F8F6F2] rounded-2xl p-4 shadow-taupe border border-[#DDD8D0] dark:border-[#333842]">
        <p className="text-xs text-[#2D2D2D]/70 dark:text-[#A0AEC0] font-semibold mb-1">Current Plan</p>
        <p className="font-bold text-sm mb-3 text-[#2D2D2D] dark:text-[#F8F6F2]">Pro Architect</p>
        <div className="h-2 w-full bg-[#F8F6F2] dark:bg-[#121417] rounded-full overflow-hidden mb-2">
          <div className="bg-[#5D8D8E] h-full w-2/3"></div>
        </div>
        <p className="text-[10px] text-[#2D2D2D]/80 dark:text-[#CBD5E1] font-medium">67% of monthly receipts used</p>
      </div>

    </aside>
  );
};


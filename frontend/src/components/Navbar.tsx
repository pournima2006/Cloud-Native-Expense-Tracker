import React from 'react';
import { User } from '../types';
import { Scan, LogOut, Sun, Moon, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenUpload }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 bg-[#F8F6F2] dark:bg-[#181A1D] border-b border-[#DDD8D0] dark:border-[#2A2E35] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 shrink-0 transition-colors">
      
      {/* Title & Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#5D8D8E] rounded-xl flex items-center justify-center text-[#F8F6F2] shadow-xs shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">Expense Tracker</h1>
          <p className="text-[11px] text-[#666666] dark:text-[#A0AEC0] hidden sm:block">Automated OCR receipt scanner & financial dashboard</p>
        </div>
      </div>

      {/* User Actions, Theme Toggle & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-xl bg-[#CDC8C0]/40 dark:bg-[#2A2E35] text-[#2D2D2D] dark:text-[#F8F6F2] hover:bg-[#CDC8C0] dark:hover:bg-[#333842] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#79B4B5]" /> : <Moon className="w-4 h-4 text-[#2D2D2D]" />}
        </button>

        {user && (
          <>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Scan</span>
            </button>

            <div className="h-6 w-px bg-[#DDD8D0] dark:bg-[#2A2E35]"></div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-[#CDC8C0] dark:bg-[#2E343D] text-[#2D2D2D] dark:text-[#F8F6F2] font-bold rounded-full border-2 border-[#F8F6F2] dark:border-[#181A1D] shadow-xs flex items-center justify-center text-xs shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#F8F6F2] leading-none">{user.username}</p>
                <p className="text-[10px] text-[#666666] dark:text-[#A0AEC0] leading-none mt-1">{user.email}</p>
              </div>
              
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] hover:bg-[#CDC8C0]/50 dark:hover:bg-[#2A2E35] rounded-lg transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

      </div>

    </header>
  );
};


import React, { useEffect, useState } from 'react';
import { User, Category } from './types';
import { authAPI, expenseAPI } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UploadModal } from './components/UploadModal';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Receipts } from './pages/Receipts';
import { Reports } from './pages/Reports';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [publicView, setPublicView] = useState<'landing' | 'login' | 'register'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check current session
  const checkSession = async () => {
    setIsAuthChecking(true);
    try {
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        fetchCategories();
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsAuthChecking(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await expenseAPI.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setPublicView('landing'); // Redirect directly to Landing Page on logout
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex flex-col items-center justify-center text-[#5D8D8E] font-sans">
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#5D8D8E]" />
        <span className="text-sm font-semibold text-[#2D2D2D]">Initializing Expense Tracker...</span>
      </div>
    );
  }

  // Render Public views if not logged in
  if (!user) {
    if (publicView === 'login') {
      return (
        <Login
          onLoginSuccess={(u) => {
            setUser(u);
            fetchCategories();
            setActiveTab('dashboard');
          }}
          onSwitchToRegister={() => setPublicView('register')}
          onNavigateToHome={() => setPublicView('landing')}
        />
      );
    }

    if (publicView === 'register') {
      return (
        <Register
          onRegisterSuccess={(u) => {
            setUser(u);
            fetchCategories();
            setActiveTab('dashboard');
          }}
          onSwitchToLogin={() => setPublicView('login')}
          onNavigateToHome={() => setPublicView('landing')}
        />
      );
    }

    // Default public view: Minimalist Landing Page
    return (
      <LandingPage
        onNavigateToLogin={() => setPublicView('login')}
        onNavigateToRegister={() => setPublicView('register')}
        isLoggedIn={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#E2E8F0] font-sans flex flex-col md:flex-row antialiased">
      
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenUpload={() => setIsUploadModalOpen(true)}
              categories={categories}
              onEditExpense={() => setActiveTab('expenses')}
              onDeleteExpense={() => triggerRefresh()}
            />
          )}

          {activeTab === 'expenses' && (
            <Expenses
              categories={categories}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'receipts' && (
            <Receipts
              categories={categories}
              onExpenseCreated={triggerRefresh}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <Reports userEmail={user.email} />
          )}
        </main>
      </div>

      {/* Global OCR Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        categories={categories}
        onExpenseCreated={() => {
          triggerRefresh();
          setActiveTab('expenses');
        }}
      />

    </div>
  );
}

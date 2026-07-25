import React from 'react';
import { 
  Scan, 
  Layers, 
  BarChart3, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  Receipt,
  PieChart,
  Globe,
  Github,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateToDashboard?: () => void;
  isLoggedIn?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToDashboard,
  isLoggedIn = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Scan,
      color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
      title: 'OCR Receipt Scanner',
      description: 'Upload physical bills, store receipts, or invoices. Tesseract OCR instantly extracts total amount, merchant, and dates.',
    },
    {
      icon: Layers,
      color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
      title: 'Smart Categorization',
      description: 'Automated tagging classifies expenses into Food, Transport, Utilities, Shopping, and Travel with zero manual typing.',
    },
    {
      icon: BarChart3,
      color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
      title: 'Monthly Analytics',
      description: 'Interactive category breakdowns, monthly spending trends, and average ticket statistics at a glance.',
    },
    {
      icon: Mail,
      color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
      title: 'Automated Email Reports',
      description: 'Generate polished HTML financial summaries and email them directly to your inbox or accounting team.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Bill or Invoice',
      description: 'Drag & drop your receipt image directly into the OCR scanner modal.',
      icon: Receipt,
    },
    {
      number: '02',
      title: 'AI Auto-Extraction',
      description: 'Our engine extracts merchant names, purchase totals, and transaction dates in seconds.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Track & Analyze',
      description: 'Review your filtered transactions, charts, and export monthly spending summaries.',
      icon: PieChart,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#E2E8F0] font-sans flex flex-col antialiased selection:bg-[#5D8D8E] selection:text-[#F8F6F2] transition-colors">
      
      {/* Public Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#F8F6F2]/90 dark:bg-[#121417]/90 backdrop-blur-md border-b border-[#DDD8D0] dark:border-[#2D323A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#5D8D8E] rounded-xl flex items-center justify-center text-[#F8F6F2] shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#2D2D2D] dark:text-[#F8F6F2] block leading-none">Expense Tracker</span>
              <span className="text-[10px] text-[#666666] dark:text-[#A0AEC0] font-semibold tracking-wider uppercase">Smart OCR Financial Suite</span>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl bg-[#CDC8C0]/30 dark:bg-[#2A2E35] text-[#2D2D2D] dark:text-[#F8F6F2] hover:bg-[#CDC8C0]/50 dark:hover:bg-[#333842] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#79B4B5]" /> : <Moon className="w-4 h-4 text-[#2D2D2D]" />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={onNavigateToDashboard}
                className="px-5 py-2.5 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateToLogin}
                  className="px-4 sm:px-5 py-2.5 text-[#2D2D2D] dark:text-[#F8F6F2] hover:bg-[#CDC8C0]/30 dark:hover:bg-[#2A2E35] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onNavigateToRegister}
                  className="px-4 sm:px-5 py-2.5 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-[#F8F6F2] dark:bg-[#121417] border-b border-[#DDD8D0] dark:border-[#2D323A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#5D8D8E]/15 border border-[#5D8D8E]/30 px-3.5 py-1.5 rounded-full text-[#5D8D8E] dark:text-[#79B4B5] text-xs font-semibold mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-[#5D8D8E] dark:text-[#79B4B5]" />
            <span>Cloud-Native AWS S3 & OCR Scanner Ready</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#2D2D2D] dark:text-[#F8F6F2] max-w-4xl mx-auto leading-[1.1]">
            Expense Tracker with <span className="text-[#5D8D8E] dark:text-[#79B4B5]">AI & OCR Scanning</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#666666] dark:text-[#A0AEC0] max-w-2xl mx-auto leading-relaxed">
            Automate your financial record-keeping. Scan physical receipt bills using built-in Tesseract OCR, categorize expenditures instantly, and deliver automated email reports.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-2xl text-sm font-bold shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateToRegister}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] rounded-2xl text-sm font-bold shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onNavigateToLogin}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#CDC8C0]/30 dark:bg-[#2A2E35] hover:bg-[#CDC8C0]/50 dark:hover:bg-[#333842] text-[#2D2D2D] dark:text-[#F8F6F2] border border-[#DDD8D0] dark:border-[#2D323A] rounded-2xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Sign In to Account</span>
                </button>
              </>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#666666] dark:text-[#A0AEC0] font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#5D8D8E] dark:text-[#79B4B5]" />
              <span>Automatic Tesseract OCR</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#5D8D8E] dark:text-[#79B4B5]" />
              <span>Isolated Express Session Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#5D8D8E] dark:text-[#79B4B5]" />
              <span>RESTful API Architecture</span>
            </div>
          </div>

        </div>
      </section>

      {/* Key Features Grid Section */}
      <section className="py-16 bg-[#F8F6F2] dark:bg-[#121417] border-b border-[#DDD8D0] dark:border-[#2D323A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">
              Engineered for Speed & Accuracy
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A0AEC0] mt-2">
              Everything you need to organize personal or business expenditures in a single modular dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-6 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe hover:border-[#5D8D8E] dark:hover:border-[#79B4B5] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#5D8D8E]/15 text-[#5D8D8E] dark:text-[#79B4B5] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-[#666666] dark:text-[#A0AEC0] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F8F6F2] dark:bg-[#121417] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#5D8D8E] dark:text-[#79B4B5] uppercase tracking-wider">Simple 3-Step Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight mt-1">
              How Expense Tracker Simplifies Expenditures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="bg-[#F8F6F2] dark:bg-[#1C1F24] p-8 rounded-3xl border border-[#DDD8D0] dark:border-[#2D323A] shadow-taupe relative flex flex-col items-start transition-colors">
                  <div className="flex items-center justify-between w-full mb-6">
                    <span className="text-3xl font-black text-[#5D8D8E] dark:text-[#79B4B5]">{step.number}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#CDC8C0]/40 dark:bg-[#2A2E35] text-[#2D2D2D] dark:text-[#F8F6F2] flex items-center justify-center">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#2D2D2D] dark:text-[#F8F6F2] text-lg mb-2">{step.title}</h3>
                  <p className="text-xs text-[#666666] dark:text-[#A0AEC0] leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="bg-[#F8F6F2] dark:bg-[#121417] border-t border-[#DDD8D0] dark:border-[#2D323A] mt-auto py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-[#5D8D8E] rounded-lg flex items-center justify-center text-[#F8F6F2]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#2D2D2D] dark:text-[#F8F6F2]">Expense Tracker</span>
          </div>

          <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">
            &copy; {new Date().getFullYear()} Expense Tracker Technologies. All rights reserved.
          </p>

          <div className="flex items-center space-x-4 text-xs text-[#666666] dark:text-[#A0AEC0] font-medium">
            <span className="hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] transition-colors cursor-pointer">Privacy</span>
            <span>&bull;</span>
            <span className="hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] transition-colors cursor-pointer">Terms</span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] transition-colors cursor-pointer">
              <Github className="w-3.5 h-3.5" />
              <span>AWS S3 & MySQL</span>
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};


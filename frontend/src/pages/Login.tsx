import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types';
import { Receipt, LogIn, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
  onNavigateToHome?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister, onNavigateToHome }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Please fill in both email/username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authAPI.login(emailOrUsername, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Register or login a test user
      try {
        await authAPI.register('demouser', 'demo@expensetracker.com', 'password123');
      } catch (regErr) {
        // user might already exist
      }
      const res = await authAPI.login('demo@expensetracker.com', 'password123');
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError('Demo login error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#121417] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5D8D8E] text-[#F8F6F2] shadow-xs mb-4">
          <Receipt className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">Expense Tracker & OCR</h2>
        <p className="mt-1 text-xs text-[#666666] dark:text-[#A0AEC0]">Sign in to manage expenses and scan receipts</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#F8F6F2] dark:bg-[#1C1F24] py-8 px-6 shadow-taupe border border-[#DDD8D0] dark:border-[#2D323A] sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Email or Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="e.g. demo@expensetracker.com"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-lg text-sm bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E]"
                />
                <Mail className="w-4 h-4 text-[#666666] dark:text-[#A0AEC0] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-lg text-sm bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E]"
                />
                <Lock className="w-4 h-4 text-[#666666] dark:text-[#A0AEC0] absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#5D8D8E] hover:bg-[#4A7374] text-[#F8F6F2] font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DDD8D0] dark:border-[#2D323A]"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#F8F6F2] dark:bg-[#1C1F24] px-2 text-[#666666] dark:text-[#A0AEC0]">Or Quick Start</span></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full mt-4 bg-[#2D2D2D] dark:bg-[#2A2E35] hover:bg-[#1A1A1A] dark:hover:bg-[#333842] text-[#F8F6F2] font-medium py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#79B4B5]" />
            <span>Instant Demo Account Login</span>
          </button>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-[#5D8D8E] dark:text-[#79B4B5] font-semibold hover:underline cursor-pointer"
              >
                Register here
              </button>
            </p>
            {onNavigateToHome && (
              <div>
                <button
                  onClick={onNavigateToHome}
                  className="text-xs text-[#666666] dark:text-[#A0AEC0] hover:text-[#2D2D2D] dark:hover:text-[#F8F6F2] font-medium cursor-pointer"
                >
                  &larr; Back to Home Landing Page
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

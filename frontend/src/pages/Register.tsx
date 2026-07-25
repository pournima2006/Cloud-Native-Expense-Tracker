import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types';
import { Receipt, UserPlus, Lock, Mail, User as UserIcon, AlertCircle } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
  onNavigateToHome?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin, onNavigateToHome }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authAPI.register(username, email, password);
      if (res.success && res.user) {
        onRegisterSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email/username.');
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
        <h2 className="text-2xl font-bold text-[#2D2D2D] dark:text-[#F8F6F2] tracking-tight">Create Account</h2>
        <p className="mt-1 text-xs text-[#666666] dark:text-[#A0AEC0]">Start tracking expenses and scanning receipts</p>
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
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. john_doe"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-[#DDD8D0] dark:border-[#2D323A] rounded-lg text-sm bg-[#F8F6F2] dark:bg-[#121417] text-[#2D2D2D] dark:text-[#F8F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#5D8D8E]"
                />
                <UserIcon className="w-4 h-4 text-[#666666] dark:text-[#A0AEC0] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#F8F6F2] mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
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
                  placeholder="Minimum 6 characters"
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
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-[#666666] dark:text-[#A0AEC0]">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-[#5D8D8E] dark:text-[#79B4B5] font-semibold hover:underline cursor-pointer"
              >
                Sign in
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

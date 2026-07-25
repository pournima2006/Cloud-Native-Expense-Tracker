import { Expense, Category, AnalyticsSummary, OCRResult, User } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Essential for express-session cookie
    headers: {
      ...(options.headers || {}),
    },
  };

  if (options.body && !(options.body instanceof FormData)) {
    (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An unexpected server error occurred.');
  }

  return data as T;
}

export const authAPI = {
  login: (emailOrUsername: string, password: string) =>
    request<{ success: boolean; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    }),

  register: (username: string, email: string, password: string) =>
    request<{ success: boolean; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  logout: () => request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),

  getMe: () => request<{ success: boolean; user: User }>('/auth/me'),
};

export const expenseAPI = {
  getAll: (filters?: { category_id?: number; start_date?: string; end_date?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category_id) params.append('category_id', String(filters.category_id));
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ success: boolean; expenses: Expense[] }>(`/expenses${query}`);
  },

  getById: (id: number) => request<{ success: boolean; expense: Expense }>(`/expenses/${id}`),

  create: (data: { category_id: number; merchant_name: string; amount: number; expense_date: string; notes?: string; receipt_url?: string | null; image_url?: string | null; imageUrl?: string | null; raw_ocr_text?: string | null }) =>
    request<{ success: boolean; expenseId: number; message: string }>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { category_id: number; merchant_name: string; amount: number; expense_date: string; notes?: string }) =>
    request<{ success: boolean; message: string }>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) => request<{ success: boolean; message: string }>(`/expenses/${id}`, { method: 'DELETE' }),

  getCategories: () => request<{ success: boolean; categories: Category[] }>('/expenses/categories'),

  getAnalytics: () => request<{ success: boolean; summary: AnalyticsSummary }>('/expenses/analytics'),
};

export const ocrAPI = {
  scanReceipt: (file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);

    return request<{ success: boolean; extractedData: OCRResult; message: string }>('/ocr/scan', {
      method: 'POST',
      body: formData,
    });
  },
};

export const reportAPI = {
  sendMonthlyReport: (targetMonth?: string) =>
    request<{ success: boolean; message: string; previewUrl?: string; reportSummary: any }>('/reports/send-monthly', {
      method: 'POST',
      body: JSON.stringify({ targetMonth }),
    }),
};

import { Request, Response } from 'express';

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

export interface CategoryDTO {
  id: number;
  user_id: number | null;
  name: string;
  icon: string;
  color: string;
  created_at?: string;
}

export interface ExpenseDTO {
  id: number;
  user_id: number;
  category_id: number;
  merchant_name: string;
  amount: number;
  expense_date: string;
  notes?: string;
  receipt_url?: string;
  raw_ocr_text?: string;
  created_at?: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface OCRResultDTO {
  merchantName: string;
  amount: number;
  date: string;
  suggestedCategoryId: number;
  confidenceScore: number;
  rawText: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  session: Request['session'] & {
    userId?: number;
    username?: string;
    email?: string;
  };
}

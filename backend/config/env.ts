import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env if present
dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Database Configuration
  DB_HOST: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10),
  DB_USER: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'expense_tracker',
  
  // Session Configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'expense_tracker_secure_session_secret_2026',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Email / SMTP Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'reports@expensetracker.com',

  // Gemini / AI Config
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || '',
};

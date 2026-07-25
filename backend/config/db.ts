import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

// Memory / Local Storage structure for non-MySQL fallback
interface MemoryDB {
  users: Array<{ id: number; username: string; email: string; password_hash: string; created_at: string }>;
  categories: Array<{ id: number; user_id: number | null; name: string; icon: string; color: string; created_at: string }>;
  expenses: Array<{ id: number; user_id: number; category_id: number; merchant_name: string; amount: number; expense_date: string; notes: string; receipt_url?: string; image_url?: string; raw_ocr_text?: string; created_at: string }>;
  nextUserId: number;
  nextCategoryId: number;
  nextExpenseId: number;
}

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

function loadMemoryData(): MemoryDB {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading data_store.json:', err);
  }

  const initialData: MemoryDB = {
    users: [
      { id: 1, username: 'demouser', email: 'demo@expensetracker.com', password_hash: '$2b$10$7A..i1t1YHwzP9u8dTDN6uV4ZToqvd1pHogTsm.tWSXGs.UqGG65u', created_at: new Date().toISOString() }
    ],
    categories: [
      { id: 1, user_id: null, name: 'Food & Dining', icon: 'Utensils', color: '#EF4444', created_at: new Date().toISOString() },
      { id: 2, user_id: null, name: 'Transportation', icon: 'Car', color: '#3B82F6', created_at: new Date().toISOString() },
      { id: 3, user_id: null, name: 'Utilities & Bills', icon: 'Zap', color: '#F59E0B', created_at: new Date().toISOString() },
      { id: 4, user_id: null, name: 'Shopping', icon: 'ShoppingBag', color: '#10B981', created_at: new Date().toISOString() },
      { id: 5, user_id: null, name: 'Entertainment', icon: 'Film', color: '#8B5CF6', created_at: new Date().toISOString() },
      { id: 6, user_id: null, name: 'Health & Medical', icon: 'HeartPulse', color: '#EC4899', created_at: new Date().toISOString() },
      { id: 7, user_id: null, name: 'Travel', icon: 'Plane', color: '#14B8A6', created_at: new Date().toISOString() },
      { id: 8, user_id: null, name: 'General / Other', icon: 'Tag', color: '#6B7280', created_at: new Date().toISOString() },
    ],
    expenses: [
      { id: 1, user_id: 1, category_id: 1, merchant_name: 'Blue Bottle Coffee', amount: 14.50, expense_date: '2026-07-24', notes: 'Team morning espresso', created_at: new Date().toISOString() },
      { id: 2, user_id: 1, category_id: 2, merchant_name: 'Uber Travel', amount: 34.20, expense_date: '2026-07-23', notes: 'Airport ride', created_at: new Date().toISOString() },
      { id: 3, user_id: 1, category_id: 3, merchant_name: 'Google Cloud Platform', amount: 148.00, expense_date: '2026-07-20', notes: 'Server infrastructure', created_at: new Date().toISOString() },
    ],
    nextUserId: 2,
    nextCategoryId: 9,
    nextExpenseId: 4,
  };
  saveMemoryData(initialData);
  return initialData;
}

function saveMemoryData(data: MemoryDB) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data_store.json:', err);
  }
}

let dbPool: mysql.Pool | null = null;
let useMySQL = false;

// Initialize MySQL pool if configured
if (process.env.MYSQL_HOST || process.env.DB_HOST) {
  try {
    dbPool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      port: env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    useMySQL = true;
    console.log(`Using MySQL Database pool connected to ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  } catch (err) {
    console.warn('MySQL configuration present but connection failed, using fallback database engine:', err);
    useMySQL = false;
  }
} else {
  console.log('No MySQL host configured in environment. Initializing local database persistence engine.');
}

export const db = {
  async execute(sql: string, params: any[] = []): Promise<[any, any]> {
    if (useMySQL && dbPool) {
      try {
        return await dbPool.execute(sql, params);
      } catch (err: any) {
        console.warn(`[Database] MySQL unavailable (${err?.code || err?.message || 'Error'}). Disabling MySQL pool and using local database engine.`);
        useMySQL = false;
      }
    }

    // Local engine query simulator for prepared statements
    const data = loadMemoryData();
    const cleanSql = sql.trim();

    // 1. SELECT Users by email or username or id
    if (cleanSql.toUpperCase().startsWith('SELECT') && cleanSql.toLowerCase().includes('from users')) {
      let filtered = [...data.users];
      if (cleanSql.toLowerCase().includes('where email =')) {
        filtered = filtered.filter(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
      } else if (cleanSql.toLowerCase().includes('where username =')) {
        filtered = filtered.filter(u => u.username.toLowerCase() === String(params[0]).toLowerCase());
      } else if (cleanSql.toLowerCase().includes('where id =')) {
        filtered = filtered.filter(u => u.id === Number(params[0]));
      } else if (cleanSql.toLowerCase().includes('where (email =') || cleanSql.toLowerCase().includes('where (username =')) {
        const identifier = String(params[0]).toLowerCase();
        filtered = filtered.filter(u => u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier);
      }
      return [filtered, []];
    }

    // 2. INSERT into users
    if (cleanSql.toUpperCase().startsWith('INSERT INTO USERS')) {
      const newUser = {
        id: data.nextUserId++,
        username: params[0],
        email: params[1],
        password_hash: params[2],
        created_at: new Date().toISOString(),
      };
      data.users.push(newUser);
      saveMemoryData(data);
      return [{ insertId: newUser.id, affectedRows: 1 }, []];
    }

    // 3. SELECT Categories
    if (cleanSql.toUpperCase().startsWith('SELECT') && cleanSql.toLowerCase().includes('from categories')) {
      const userId = params[0] !== undefined ? Number(params[0]) : null;
      const categories = data.categories.filter(c => c.user_id === null || c.user_id === userId);
      return [categories, []];
    }

    // 4. INSERT INTO Expenses
    if (cleanSql.toUpperCase().startsWith('INSERT INTO EXPENSES')) {
      const receiptUrlVal = params[6] ? String(params[6]) : '';
      const imageUrlVal = params[7] ? String(params[7]) : (params[6] ? String(params[6]) : '');
      const rawOcrVal = params[8] ? String(params[8]) : (params[7] && !params[8] ? String(params[7]) : '');

      const newExpense = {
        id: data.nextExpenseId++,
        user_id: Number(params[0]),
        category_id: Number(params[1]),
        merchant_name: String(params[2]),
        amount: Number(params[3]),
        expense_date: String(params[4]),
        notes: params[5] ? String(params[5]) : '',
        receipt_url: receiptUrlVal,
        image_url: imageUrlVal,
        raw_ocr_text: rawOcrVal,
        created_at: new Date().toISOString(),
      };
      data.expenses.push(newExpense);
      saveMemoryData(data);
      return [{ insertId: newExpense.id, affectedRows: 1 }, []];
    }

    // 5. UPDATE Expenses
    if (cleanSql.toUpperCase().startsWith('UPDATE EXPENSES')) {
      const id = Number(params[params.length - 1]);
      const expenseIndex = data.expenses.findIndex(e => e.id === id);
      if (expenseIndex !== -1) {
        data.expenses[expenseIndex] = {
          ...data.expenses[expenseIndex],
          category_id: Number(params[0]),
          merchant_name: String(params[1]),
          amount: Number(params[2]),
          expense_date: String(params[3]),
          notes: params[4] ? String(params[4]) : '',
        };
        saveMemoryData(data);
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }

    // 6. DELETE Expense
    if (cleanSql.toUpperCase().startsWith('DELETE FROM EXPENSES')) {
      const expenseId = Number(params[0]);
      const userId = Number(params[1]);
      const initialLen = data.expenses.length;
      data.expenses = data.expenses.filter(e => !(e.id === expenseId && e.user_id === userId));
      saveMemoryData(data);
      return [{ affectedRows: initialLen - data.expenses.length }, []];
    }

    // 7. SELECT Expenses (with joins / filters)
    if (cleanSql.toUpperCase().startsWith('SELECT') && cleanSql.toLowerCase().includes('from expenses')) {
      let result = data.expenses.map(e => {
        const cat = data.categories.find(c => c.id === e.category_id) || {
          name: 'General / Other',
          color: '#6B7280',
          icon: 'Tag',
        };
        return {
          ...e,
          category_name: cat.name,
          category_color: cat.color,
          category_icon: cat.icon,
        };
      });

      // Filter by user_id
      if (params.length > 0 && typeof params[0] === 'number') {
        const userId = params[0];
        result = result.filter(e => e.user_id === userId);
      }

      // Sort by expense_date DESC
      result.sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime());

      return [result, []];
    }

    return [[], []];
  },

  async query(sql: string, params: any[] = []): Promise<[any, any]> {
    return this.execute(sql, params);
  }
};

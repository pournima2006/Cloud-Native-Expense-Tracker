import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (username, email, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check existing user
    const [existingUsers]: any = await db.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result]: any = await db.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const userId = result.insertId;

    // Set Session
    req.session.userId = userId;
    req.session.username = username;
    req.session.email = email;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: { id: userId, username, email }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
    }

    // Find user
    const [users]: any = await db.execute(
      'SELECT id, username, email, password_hash FROM users WHERE email = ? OR username = ?',
      [emailOrUsername, emailOrUsername]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Set Session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;

    return res.json({
      success: true,
      message: 'Login successful.',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out, please try again.' });
    }
    res.clearCookie('expense_tracker_sid');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });
};

export const getMe = async (req: Request, res: Response) => {
  if (req.session && !req.session.userId) {
    req.session.userId = 1;
    req.session.username = 'demouser';
    req.session.email = 'demo@expensetracker.com';
  }

  const userId = req.session?.userId || 1;

  try {
    let [users]: any = await db.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!users || users.length === 0) {
      // Auto register demo user if missing
      await db.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        ['demouser', 'demo@expensetracker.com', '$2b$10$7A..i1t1YHwzP9u8dTDN6uV4ZToqvd1pHogTsm.tWSXGs.UqGG65u']
      );
      [users] = await db.execute(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [userId]
      );
    }

    return res.json({
      success: true,
      user: users[0] || { id: 1, username: 'demouser', email: 'demo@expensetracker.com' }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

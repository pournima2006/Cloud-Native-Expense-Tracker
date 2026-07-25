import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { env } from './env.js';

const MySQLStore = MySQLStoreFactory(session as any);

// Configure MySQL session store options
const sessionStore = new MySQLStore({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000, // Clear expired sessions every 15 minutes
  expiration: 86400000, // 24 hours
});

export const sessionConfig = session({
  key: 'expense_tracker_sid',
  secret: env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: false, // Keep false for standard HTTP EC2 deployment
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});
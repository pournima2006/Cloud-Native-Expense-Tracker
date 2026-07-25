-- Expense Tracker Database Schema (MySQL Compatible)
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL means default system category
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(30) DEFAULT 'Tag',
    color VARCHAR(20) DEFAULT '#6366F1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    merchant_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    notes TEXT,
    receipt_url VARCHAR(255),
    image_url VARCHAR(512) DEFAULT NULL,
    raw_ocr_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default Categories Seed Data
INSERT INTO categories (user_id, name, icon, color) VALUES
(NULL, 'Food & Dining', 'Utensils', '#EF4444'),
(NULL, 'Transportation', 'Car', '#3B82F6'),
(NULL, 'Utilities & Bills', 'Zap', '#F59E0B'),
(NULL, 'Shopping', 'ShoppingBag', '#10B981'),
(NULL, 'Entertainment', 'Film', '#8B5CF6'),
(NULL, 'Health & Medical', 'HeartPulse', '#EC4899'),
(NULL, 'Travel', 'Plane', '#14B8A6'),
(NULL, 'General / Other', 'Tag', '#6B7280')
ON DUPLICATE KEY UPDATE name=VALUES(name);

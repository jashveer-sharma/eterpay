-- EterPay D1 Database Schema
-- Migration 0001: Initial schema (mirrors SQLite schema used in development)
-- Apply with: npx wrangler d1 execute eterpay-db --file=migrations/0001_init.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    country TEXT DEFAULT 'IN',
    currency TEXT DEFAULT 'INR',
    account_type TEXT DEFAULT 'personal',
    kyc_status TEXT DEFAULT 'unverified',
    plan TEXT DEFAULT 'EterPay Free',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- PayPal orders table
CREATE TABLE IF NOT EXISTS paypal_orders (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT UNIQUE,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'CREATED',
    approval_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Transactions ledger
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    order_id TEXT,
    capture_id TEXT,
    type TEXT NOT NULL,
    category TEXT DEFAULT 'transfer',
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    ref TEXT,
    counterparty TEXT,
    note TEXT,
    payer_email TEXT,
    transaction_time TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- Rate alerts
CREATE TABLE IF NOT EXISTS rate_alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    from_currency TEXT NOT NULL,
    to_currency TEXT NOT NULL,
    target_rate REAL NOT NULL,
    direction TEXT NOT NULL,
    is_triggered INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_paypal_orders_idempotency ON paypal_orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_rate_alerts_user ON rate_alerts(user_id);

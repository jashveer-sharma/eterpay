# Database Schema — EterPay

```sql
-- 1. Users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    base_currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Transactions (Double-Entry Audit)
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    paypal_order_id VARCHAR(100) UNIQUE,
    paypal_capture_id VARCHAR(100),
    amount_source NUMERIC(14, 2) NOT NULL,
    currency_source VARCHAR(3) NOT NULL,
    amount_target NUMERIC(14, 2) NOT NULL,
    currency_target VARCHAR(3) NOT NULL,
    exchange_rate NUMERIC(12, 6) NOT NULL,
    estimated_fee NUMERIC(10, 2) DEFAULT 0.00,
    merchant_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Travel',
    status VARCHAR(30) NOT NULL, -- PENDING, COMPLETED, FAILED, REFUNDED
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Simulated Portfolios
CREATE TABLE simulated_portfolios (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    currency VARCHAR(3) NOT NULL,
    allocated_inr NUMERIC(14, 2) NOT NULL,
    foreign_units NUMERIC(14, 4) NOT NULL,
    purchase_rate NUMERIC(12, 6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

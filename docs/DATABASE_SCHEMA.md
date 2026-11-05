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

-- 4. Payment Providers Registry (EterPay Anywhere)
CREATE TABLE payment_providers (
    id VARCHAR(36) PRIMARY KEY,
    provider_code VARCHAR(50) UNIQUE NOT NULL, -- PRV-PAYPAL-V2, PRV-NIPL-UPI, etc.
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- INTERNATIONAL_PSP, NATIONAL_SWITCH, REGIONAL_WALLET
    supported_countries JSONB NOT NULL,
    settlement_currencies JSONB NOT NULL,
    is_live_sandbox BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Merchant Acceptance Directory (EterPay Anywhere)
CREATE TABLE merchants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mcc VARCHAR(10) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    city VARCHAR(100),
    accepted_currencies JSONB NOT NULL,
    accepted_providers JSONB NOT NULL,
    qr_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Smart Invoices (EterPay Business)
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    merchant_user_id VARCHAR(36) REFERENCES users(id),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    service_description TEXT NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE, CANCELLED
    paypal_order_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

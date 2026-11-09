# EterPay — Frontend Demo Data Architecture

> Source Module: `src/lib/demo-data.ts`

## 1. Overview
All data within the EterPay application is maintained through a structured, strictly-typed mock repository to ensure immediate offline functionality, zero third-party data leaks, and deterministic state transitions.

---

## 2. Mock Entities

### `DEMO_USER`
- **Identity:** Alex Rivera (`usr_eterpay_demo`)
- **Status:** KYC Tier 2 Verified, 2FA Active
- **Credentials:** `demo@eterpay.com` / `Demo1234!`
- **Region:** India (`INR` primary currency)

### `DEMO_BALANCES`
- **Primary:** INR ₹184,250.75 (Available: ₹180,000.00)
- **Sub-Wallets:**
  - USD: $1,240.50 🇺🇸
  - EUR: €876.20 🇪🇺
  - GBP: £420.00 🇬🇧
  - JPY: ¥95,000 🇯🇵
  - SGD: S$680.30 🇸🇬

### `DEMO_TRANSACTIONS` (12 Sample Records)
- Covers debits, credits, transfers, refunds, commerce orders, travel tickets, and investments.
- Unique alphanumeric reference tokens (e.g., `TXN20261104001`).

### `DEMO_PAYMENT_METHODS`
- UPI (`alex@eterpay`)
- HDFC Credit Card (`Visa •••• 4821`)
- SBI Debit Card (`RuPay •••• 9043`)
- HDFC Direct Bank Account (`•••• 7812`)
- EterPay Wallet (`₹180,000`)
- PayPal Sandbox Account (`alex.rivera@paypal.com`)

### `DEMO_INVOICES` (5 Invoices)
- Paid, Pending, Overdue, and Draft states with client emails and line item structures.

### `DEMO_PORTFOLIO`
- Total Value: ₹258,400 (+2.14% 24h Yield)
- Assets: Gold Fund, NIFTY 50 Index, US Technology ETF, Sovereign Bond, FX Reserve.
- Permanent UI Banner: `[Simulated Portfolio — Educational Only — No Capital at Risk]`.

### `DEMO_PAYMENT_NETWORKS_ANYWHERE`
- 8 international clearing protocols modeled: PayPal, Visa Direct, Mastercard Send, UPI, RuPay, SEPA, PromptPay, PIX.

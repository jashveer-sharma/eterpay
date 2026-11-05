# EterPay — Modular System Architecture & Event Flow

> **Unified Multi-Module Financial Ecosystem**  
> **Backend Engine:** FastAPI (Python 3.11) · **Frontend Interface:** Next.js 15 (App Router, Tailwind CSS, AG Grid Community v32)

---

## 1. High-Level Modular Topology

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ETERPAY UNIFIED FRONTEND                                  │
│  ┌───────────────────────┐  ┌───────────────────────────────────────────────────────┐  │
│  │ Navigation & Persona  │  │ Dynamic Module Viewports                             │  │
│  │ • Personal Mode       │  │ • EterPay Pay (Checkout & Links)                      │  │
│  │ • Merchant Mode       │  │ • EterPay Wallet & Ledger (AG Grid Community v32)     │  │
│  │ • Admin Mode          │  │ • EterPay Invoices & Subscriptions                    │  │
│  │                       │  │ • EterPay Global & Calculator                         │  │
│  │                       │  │ • EterPay Commerce (Channel3 Graph)                   │  │
│  │                       │  │ • EterPay Invest & FX Stress-Test                     │  │
│  └───────────┬───────────┘  └───────────────────────────┬───────────────────────────┘  │
│              │                                          │                              │
│              └────────────────────────┬─────────────────┘                              │
│                                       │ HTTPS / JSON                                   │
└───────────────────────────────────────┼────────────────────────────────────────────────┘
                                        │
┌───────────────────────────────────────▼────────────────────────────────────────────────┐
│                             ETERPAY FASTAPI BACKEND                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Central Router (`/api`)                                                          │  │
│  │ • `/chat` (AI Multi-Tier Tool Dispatcher)                                        │  │
│  │ • `/paypal` (`create-order`, `capture-order`, `webhook`, `invoices`, `payouts`)  │  │
│  │ • `/currency` (`rates`, `convert`, `history`)                                    │  │
│  │ • `/commerce` (`search`, `cart`, `checkout`)                                     │  │
│  │ • `/invest` (`portfolio`, `stress-test`)                                         │  │
│  └────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                       │                                                │
│  ┌────────────────────────────────────▼─────────────────────────────────────────────┐  │
│  │ Core Services Layer                                                              │  │
│  │ • `SafetyEngine` (UUIDv4 Idempotency, Single-Order Limits, Spend Caps)           │  │
│  │ • `PayPalClient` (OAuth2 Token, Orders v2, Capture, Webhook Signature Check)    │  │
│  │ • `CurrencyClient` (Frankfurter ECB Client, 1-Hour In-Memory Cache)              │  │
│  │ • `AIAgentOrchestrator` (Gemini Flash -> Groq Llama 3.3 -> Deterministic NLP)   │  │
│  └────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                       │                                                │
│  ┌────────────────────────────────────▼─────────────────────────────────────────────┐  │
│  │ Shared Ledger & Event Bus                                                        │  │
│  │ • Single Source of Truth Transaction Ledger                                      │  │
│  │ • Non-Duplicative Event Model: ORDER_CREATED -> APPROVED -> CAPTURED -> COMMITTED│  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Shared Data Entities & Transaction Lifecycles

### Master Transaction Event Model
Every financial action in EterPay generates an immutable event record:

```json
{
  "event_id": "EVT-8F92A10B",
  "idempotency_key": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "order_id": "8AB12345CD67",
  "module": "PAY | COMMERCE | INVOICE | TRAVEL",
  "event_type": "ORDER_CREATED | PAYMENT_CAPTURED | WEBHOOK_VERIFIED | INVOICE_PAID",
  "source_user_id": "USR-PERSONAL-001",
  "counterparty": "Anker Official Store",
  "amount": 17.80,
  "currency": "USD",
  "inr_equivalent": 1499.00,
  "ecb_rate": 0.01188,
  "status": "COMPLETED",
  "verified_by_webhook": true,
  "created_at": "2026-11-05T15:00:00Z"
}
```

### Module Cross-Talk Workflows
1. **Commerce to Pay:** A product selection in EterPay Commerce emits an `order_request` to EterPay Pay, generating a PayPal Orders v2 record.
2. **Pay to Ledger:** A successful PayPal capture triggers an immediate append to the AG Grid audit ledger.
3. **Pay to Invoices:** A completed payment matching an invoice ID updates the invoice status from `PENDING` to `PAID`.
4. **Travel to Currency:** Setting a travel destination dynamically updates the currency conversion ticker and calculates local allocation buckets.
5. **AI to Everything:** EterPay AI accesses read-only hooks across all modules and dispatches parameterized action proposals requiring human approval.

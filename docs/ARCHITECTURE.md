# System Architecture — EterPay

## 1. High-Level Architecture
```
┌────────────────────────────────────────────────────────┐
│             FRONTEND CLIENT (Next.js 15)               │
│  • Chat & Action Card UI  • AG Grid Portfolio/Ledger   │
│  • PayPal JS SDK v6 Modal • Channel3 Product Carousel  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST
┌───────────────────────────▼────────────────────────────┐
│              BACKEND API (FastAPI Python)              │
│  • Auth & Idempotency     • Pydantic Schema Validation │
│  • LangGraph Tool Agent   • PayPal Orders API Client   │
│  • Webhook Signature Auth • Frankfurter Currency Feed  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    DATA LAYER                          │
│  • PostgreSQL (Transactions, Ledgers, Portfolios)      │
└────────────────────────────────────────────────────────┘
```

## 2. Key Architectural Invariants
1. Frontend never talks to PayPal directly using secrets.
2. AI outputs never mutate the database directly.
3. Every order creation is accompanied by an Idempotency Key (UUID v4).
4. Webhooks asynchronously verify capture state.

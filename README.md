# EterPay

**Your Money. Everywhere. Intelligently Connected.**

EterPay is an AI-powered global financial platform built to unify payments, currency exchange, and financial management into a single intelligent experience. It supports multi-currency wallets, real PayPal payment processing, an AI financial assistant, and EterPay Anywhere — a cross-border payment interoperability layer.

---

## Features

| Module | Description |
|---|---|
| **Multi-Currency Wallet** | Hold, convert and manage balances across 30+ currencies with live ECB rates |
| **Send & Request** | Peer-to-peer payments, payment links and QR code generation |
| **EterPay Anywhere** | Cross-border payment routing — pay any recipient, any country, any method |
| **AI Financial Assistant** | Conversational assistant powered by Gemini 1.5 Flash for spending insights, payment initiation and financial analysis |
| **Invoicing & Subscriptions** | Professional invoice creation and recurring billing management |
| **Travel Wallet** | Automatic currency switching, travel cards and destination-aware exchange |
| **Commerce Integration** | Merchant dashboard, product catalog and embedded checkout |
| **Analytics** | Spending breakdowns, cash flow charts and AI-generated financial summaries |

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS — Miligram-inspired design system (cream `#fbf9f5`, forest green `#0f4d40`)
- AG Grid — high-performance transaction ledger and analytics tables
- Framer Motion — page transitions and micro-interactions

**Backend**
- FastAPI (Python 3.11+) + Pydantic v2
- SQLAlchemy async + SQLite (dev) / PostgreSQL (production)
- HTTPX for external API calls

**Payments**
- PayPal Orders v2 API — real sandbox order creation, modal approval and capture
- Webhook signature verification for server-side payment confirmation

**AI**
- Google Gemini 1.5 Flash (primary) — free tier, conversational tool calling
- Groq Llama 3.3 70B (fallback) — zero-cost secondary model

**Market Data**
- Frankfurter ECB API (`api.frankfurter.app`) — free, no API key required

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# PayPal (Sandbox)
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# AI Models
GEMINI_API_KEY=your_gemini_key        # free at aistudio.google.com
GROQ_API_KEY=your_groq_key            # free at console.groq.com

# Database
DATABASE_URL=sqlite+aiosqlite:///./eterpay.db
```

---

## Demo

| Field | Value |
|---|---|
| Email | `demo@eterpay.com` |
| Password | `Demo1234!` |

The demo account uses mocked data. No real payments are processed unless PayPal sandbox credentials are configured.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  EterPay Frontend                 │
│          Next.js 15 · App Router · TS             │
│                                                   │
│  Public  ──→  Auth  ──→  App Dashboard            │
│  (38 routes)                                      │
└──────────────────┬──────────────────────────────-─┘
                   │ REST / JSON
┌──────────────────▼────────────────────────────────┐
│                 FastAPI Backend                    │
│       Pydantic v2 · SQLAlchemy async               │
│                                                   │
│  /api/payments  /api/ai  /api/fx  /api/invoices   │
└───────┬─────────────────────┬─────────────────────┘
        │                     │
   PayPal Orders v2      Gemini / Groq
   Sandbox API           AI Tool Calling
        │                     │
   Webhook Verify       Frankfurter ECB
   Ledger Commit        Live FX Rates
```

**Payment Safety Gate** — the AI assistant has no authority to move funds. Every payment requires:
1. AI intent proposal
2. Backend Pydantic validation
3. Explicit user "Approve" click
4. PayPal Orders API → modal approval
5. Webhook verification
6. Ledger commit

---

## Project Structure

```
unipay/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/   # Marketing pages + auth
│   │   │   ├── (auth)/     # Login, signup, onboarding
│   │   │   └── (app)/      # Authenticated dashboard
│   │   ├── components/
│   │   └── lib/
│   └── public/brand/       # SVG logo assets
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── core/           # AI agent, config, security
│   │   ├── models/         # SQLAlchemy models
│   │   └── services/       # PayPal, FX, AI services
│   └── requirements.txt
└── docs/                   # Architecture and feature docs
```

---

## Security Notes

- Client secrets are never exposed to the frontend
- All payment state is verified server-side via PayPal webhooks
- Every payment creation includes a UUID v4 `PayPal-Request-Id` for idempotency
- Simulated portfolio features are permanently badged: `[Simulated Portfolio — Educational Only — No Capital at Risk]`

---

## License

MIT © 2026 EterPay

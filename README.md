# EterPay — Your Money. Everywhere. Intelligently Connected.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![PayPal AI Hackathon 2026](https://img.shields.io/badge/PayPal_Hackathon-2026-00457C?logo=paypal)](https://paypalaihackathon.devpost.com/)
[![AG Grid](https://img.shields.io/badge/AG_Grid-Fintech_Terminal-00E676?logo=aggrid)](https://www.ag-grid.com/)

> **EterPay (Eternal Payments)** is an AI-powered multi-currency financial platform designed to make understanding, spending, converting, and tracking money across borders seamless. Built specifically for the **PayPal "Build What's Next with PayPal and AI" Global Hackathon 2026**.

---

## 🌟 Key Features

1. **Intelligent Travel & Multi-Currency Planning**
   * Natural-language budget creation (e.g. *"I'm traveling to Japan with ₹1,50,000. Help me plan my money."*).
   * Live ECB exchange rates via Frankfurter API with transparent spread and hidden-fee breakdown.
   * Dynamic currency exposure and volatility alerts.

2. **AG Grid Financial Terminal**
   * Multi-currency balances with 7-day inline SVG sparklines.
   * Full transaction audit ledger with status badges, sorting, and filtering.
   * **AI-Driven Grid Filtering:** The conversational assistant can directly manipulate AG Grid filter states via structured tool execution.

3. **Agentic Commerce (Powered by Channel3)**
   * AI-assisted product discovery across 25,000+ retailers.
   * Discovers travel gear and essentials matching user destination and budget constraints.
   * One-click checkout cart preparation.

4. **Deterministic Safe PayPal Sandbox Payments**
   * True server-side **PayPal Orders v2 API** integration (`create-order` & `capture-order`).
   * Seamless in-app approval via **PayPal JavaScript SDK v6** modal.
   * Real-time ledger updates verified by asynchronous PayPal Webhooks (`PAYMENT.CAPTURE.COMPLETED`).
   * **Deterministic Security Gate:** The AI model proposes transactions; the backend validates limits and idempotency; the user must explicitly click to authorize payment.

5. **Simulated Investment & Scenario Modeling**
   * Educational multi-currency scenario stress testing.
   * Visual what-if slider: observe the portfolio P&L impact if USD or JPY fluctuates.
   * Strictly disclaimed with permanent educational simulation badges.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│             FRONTEND CLIENT (Next.js 15)               │
│  • Obsidian Dark UI (#090A0F) + Neon Green (#00E676)   │
│  • Conversational Copilot & Action Approval Card       │
│  • AG Grid Multi-Currency Terminal & Sparklines        │
│  • PayPal JS SDK v6 Modal Checkout                     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST
┌───────────────────────────▼────────────────────────────┐
│              BACKEND API (FastAPI Python)              │
│  • LangGraph Tool Orchestrator                         │
│  • Primary: Gemini 1.5 Flash · Fallback: Groq Llama 3.3│
│  • Deterministic Safety & Idempotency Engine           │
│  • PayPal REST Orders v2 Client & Webhook Verifier     │
│  • Frankfurter ECB Currency Reference Feed             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    DATA STORAGE                        │
│  • PostgreSQL / SQLite (Ledger, Portfolios, Users)     │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **Python:** v3.11 or higher
* **Git:** v2.40 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eterpay.git
cd eterpay
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your sandbox credentials:
```bash
cp .env.example .env
```
*(See `.env.example` for details on obtaining free sandbox and AI keys).*

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the EterPay application.

---

## 🧪 Testing with PayPal Sandbox

To test payments without real capital:
1. Log in with a **PayPal Sandbox Buyer Account**.
2. Credentials can be generated in your [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/accounts).
3. Authorize the sandbox modal.
4. Verify the captured transaction in the AG Grid audit ledger.

---

## 📜 License & Governance

* **License:** [MIT License](LICENSE)
* **Branching Strategy:** `main` (stable releases) · `develop` (integration) · `feature/*` (feature branches).
* **Security Notice:** No live payment secrets are stored on frontend clients. All payments require human-in-the-loop authorization.

# API Integration Register & External Services (Phase 5)

> **Document Status:** Active External Services Directory  
> **Security Notice:** No secret keys or credentials are stored in this document. All credentials are isolated in local `.env` (gitignored).

---

## 1. External Services Directory

### 1. PayPal Developer Platform (Sandbox)
* **What it does:** Complete sandbox payment execution: Orders v2 API (`create` & `capture`), JS SDK v6 modal checkout, and asynchronous Webhooks (`PAYMENT.CAPTURE.COMPLETED`).
* **Why EterPay needs it:** Mandatory hackathon requirement. Powers the core payment execution flow.
* **Official Link:** `https://developer.paypal.com/dashboard/applications/sandbox`
* **Free-Tier Availability:** 100% free sandbox environment with unlimited simulated buyer/seller test accounts.
* **Credentials Required:** `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`.
* **Rate Limits:** High sandbox throughput suitable for hackathon demonstrations.
* **Geographic Restrictions:** Global sandbox availability.
* **Integration Difficulty:** 🟡 Medium.
* **Fallback Option:** Offline mock sandbox response engine in `backend/app/core/paypal_client.py` for local dev.

### 2. Google Gemini 1.5 Flash (Google AI Studio)
* **What it does:** Primary LLM for natural-language financial requests, travel budgeting, and tool calling.
* **Why EterPay needs it:** Free-tier AI model capable of native structured function calling.
* **Official Link:** `https://aistudio.google.com/`
* **Free-Tier Availability:** 100% Free Developer Tier.
* **Credentials Required:** `GEMINI_API_KEY`.
* **Rate Limits:** **15 Requests/Min (RPM) \| 1,000,000 Tokens/Min (TPM) \| 1,500 Requests/Day (RPD)**.
* **Geographic Restrictions:** Available globally in 180+ countries.
* **Integration Difficulty:** 🟢 Low (standard REST / Google GenAI SDK).
* **Fallback Option:** Instant automatic routing to Groq Cloud Llama 3.3 70B on HTTP 429.

### 3. Groq Cloud (Llama 3.3 70B Versatile)
* **What it does:** Ultra-fast, low-latency secondary fallback LLM for tool calling and financial parsing.
* **Why EterPay needs it:** Eliminates hackathon judge demo failure if Gemini hits a temporary rate limit.
* **Official Link:** `https://console.groq.com/`
* **Free-Tier Availability:** 100% Free Developer Tier on custom LPU hardware.
* **Credentials Required:** `GROQ_API_KEY`.
* **Rate Limits:** **30 Requests/Min (RPM) \| 12,000 Tokens/Min (TPM) \| 1,000 Requests/Day (RPD)**.
* **Geographic Restrictions:** Global.
* **Integration Difficulty:** 🟢 Low (OpenAI-compatible client format).
* **Fallback Option:** Deterministic rule engine for instant offline execution.

### 4. Frankfurter Currency API (European Central Bank)
* **What it does:** Real-time and historical foreign exchange rates published by the European Central Bank (ECB).
* **Why EterPay needs it:** Live FX conversion calculations and transparent spread analysis against bank markups.
* **Official Link:** `https://api.frankfurter.app/`
* **Free-Tier Availability:** **100% Free, Open Source, ZERO API Keys Required**.
* **Credentials Required:** None.
* **Rate Limits:** Open access, generous rate limits.
* **Geographic Restrictions:** None.
* **Integration Difficulty:** 🟢 Very Low (Clean JSON GET requests).
* **Fallback Option:** Local offline reference rate dictionary in `backend/app/core/currency_client.py`.

### 5. Channel3 Product Discovery API
* **What it does:** Universal product graph (100M+ products across 25,000+ retailers) for agentic commerce.
* **Why EterPay needs it:** Discovers travel accessories and gear matching user budget constraints for agentic checkout.
* **Official Link:** `https://trychannel3.com/`
* **Free-Tier Availability:** Free hackathon tier via promo code `PAYPAL-HACKATHON-2026`.
* **Credentials Required:** `CHANNEL3_API_KEY`.
* **Rate Limits:** Thousands of free queries during the hackathon period.
* **Geographic Restrictions:** Global product coverage.
* **Integration Difficulty:** 🟢 Low (Clean REST search endpoint).
* **Fallback Option:** Local curated JSON catalog (`backend/app/api/endpoints/commerce.py`).

### 6. Render Cloud Platform
* **What it does:** Cloud hosting for full-stack Next.js frontend, FastAPI backend, and PostgreSQL database.
* **Why EterPay needs it:** Provides the required public hosted demo URL for judges.
* **Official Link:** `https://render.com/`
* **Free-Tier Availability:** Free Web Service tier + 750 free monthly compute hours.
* **Credentials Required:** Render account login.
* **Rate Limits:** Spins down after 15 minutes of inactivity on free tier (cold start ~30s).
* **Geographic Restrictions:** Global CDN.
* **Integration Difficulty:** 🟢 Low (configured via `render.yaml`).
* **Fallback Option:** Local Docker / `npm run dev` setup instructions in README.

---

## 2. Environment Variable Template (`.env.example`) Reference

```env
# PayPal Sandbox Credentials
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_sandbox_webhook_id_here

# Free AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Agentic Commerce
CHANNEL3_API_KEY=your_channel3_api_key_here

# Database & Ports
DATABASE_URL=sqlite+aiosqlite:///./eterpay.db
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

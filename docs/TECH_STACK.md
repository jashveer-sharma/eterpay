# Technology Stack & Tooling — EterPay

## 1. Core Frameworks
* **Frontend:** Next.js 15 (React 19, TypeScript), Tailwind CSS, Lucide React.
* **Backend:** FastAPI (Python 3.11+), Uvicorn, Pydantic v2, SQLAlchemy async, HTTPX.
* **Database:** PostgreSQL (with SQLite local fallback).

## 2. Key Libraries & Integrations
* **Payments:** PayPal Orders REST API v2, `@paypal/react-paypal-js`, `@paypal/agent-toolkit`.
* **Grids & Analytics:** `@ag-grid-community/react`, `@ag-grid-community/core`, AG Studio Agent hook.
* **Free AI Engine:** Google Gemini 1.5 Flash (via Google AI Studio) + Groq Cloud Llama 3.3 70B fallback.
* **Currency Rates:** Frankfurter API (Free, European Central Bank reference rates).
* **Commerce:** Channel3 REST API (`PAYPAL-platform deployment-2026`) + Local JSON fallback catalog.
* **Hosting:** Render (Web Service + Managed PostgreSQL free tier).

# EterPay — Hackathon Demo Script

**Duration:** ~2 minutes 45 seconds  
**Format:** Screen recording with voiceover  
**URL:** `http://localhost:3000` (or deployed Render URL)

---

## Scene 1 — Opening Hook (0:00–0:20)

**Screen:** EterPay dashboard loads — Hallmark Dusk dark theme, ECB live rates in header ticker.

> "EterPay is an AI-powered cross-border financial platform built for the PayPal AI Hackathon.
> It connects real PayPal payments, live ECB exchange rates, conversational AI, and an AG Grid transaction ledger — all in one financial cockpit."

**Show:** Live ECB ticker in header — 4 currencies ticking with today's date.

---

## Scene 2 — AI Travel Planning (0:20–0:50)

**Action:** Click the **"Plan Tokyo Trip"** quick capsule (or type manually):
> *"I am traveling to Tokyo with 150000 INR. Help me plan my budget."*

**Screen:** Chat loading indicator → AI response with yen conversion, travel budget breakdown.

> "I ask the AI copilot to plan my Tokyo trip. It calls the convert_currency tool — fetching live ECB rates from the Frankfurter API — zero bank markup, interbank midrate."

**Show:** Treasury tab → ₹1,50,000 card, Tokyo JPY allocation updating with live rate.

---

## Scene 3 — Live Currency Calculator (0:50–1:10)

**Action:** Click **Treasury and Rates** tab → scroll to ECB Currency Calculator.

**Show:** Type `150000` INR, select `JPY` → converted amount appears instantly.

> "The interactive converter uses the same live ECB rate — no API key, no bank spread, 100% free Frankfurter data."

---

## Scene 4 — Agentic Commerce + PayPal Checkout (1:10–1:50)

**Action:** Click **Agentic Commerce** tab → click **"Prepare Checkout"** on a travel adapter product.

**Screen:** Chat receives message → AI proposes an action → Deterministic Payment Gate card appears with product title, price, merchant.

> "The AI proposes a purchase — but notice: it cannot execute it. This is the EterPay Deterministic Payment Gate. The AI proposes; the human approves."

**Action:** Click the **PayPal Pay** button in the gate card.

**Screen:** PayPal modal pops up over the page (sandbox).

> "The PayPal Orders v2 modal opens. This is a real PayPal sandbox transaction — not a simulation."

**Action:** Log in with sandbox buyer account → approve → modal closes.

**Screen:** "Payment captured" confirmation in chat → new row appears in AG Grid ledger.

> "Payment captured. Order recorded in the AG Grid transaction ledger with CAPTURED status."

---

## Scene 5 — AG Grid AI Filtering (1:50–2:15)

**Action:** Click **AG Grid Ledger** tab.

**Show:** Existing ledger rows with Tokyo Metro Pass, Airalo eSIM, Ichiran Ramen.

**Action:** Type in chat:
> *"Filter my transactions by Travel category."*

**Screen:** AI calls `update_grid_filter` tool → grid instantly filters to Travel category — no manual click.

> "The AI drives the grid filter. The `update_grid_filter` tool tells AG Grid to show only Travel transactions."

**Show:** "AI Filter: category is 'Travel'" badge appears. Click X to clear → all rows return.

---

## Scene 6 — Portfolio & Risk Stress Test (2:15–2:35)

**Action:** Click **Portfolio and Risk** tab.

**Show:** Simulation disclaimer badge → portfolio table with sparklines and P&L percentages.

**Action:** Drag the stress-test slider to -15%.

**Screen:** "Projected Impact: -₹4,500 INR" updates in real time.

> "The macro FX stress-test simulator models how a JPY shock would affect your Tokyo travel budget. Zero real transactions — always marked as educational simulation."

---

## Scene 7 — Closing (2:35–2:45)

**Screen:** Pull back to full dashboard view — header with Sandbox Active badge.

> "EterPay: real PayPal Orders v2, live ECB rates, multi-tier AI with Gemini 1.5 Flash, and AG Grid Community — all free-tier, fully open source."

**Show:** GitHub repo URL and Render deployment URL.

---

## Technical Callouts for Judges

| Feature | Implementation |
|---|---|
| PayPal Orders v2 | Real modal checkout with UUIDv4 idempotency |
| Deterministic AI gate | AI proposes → Backend validates → User clicks → PayPal API |
| Free ECB rates | Frankfurter API (zero API key, zero cost) |
| Multi-tier AI | Gemini 1.5 Flash → Groq Llama 3.3 70B → Deterministic fallback |
| AG Grid filtering | `update_grid_filter` tool call drives `setFilterModel()` |
| Simulation safety | Mandatory badge on all portfolio/invest screens |
| Security | Zero secrets in frontend; idempotency on every order |

---

## Sandbox Buyer Credentials

> Use the sandbox buyer account from [developer.paypal.com](https://developer.paypal.com/dashboard/accounts) → Sandbox → Accounts.

Typically:
- **Email:** `sb-buyer@personal.example.com` (replace with your actual sandbox buyer)
- **Password:** As set in PayPal developer dashboard

---

## Prize Category Targets

| Prize | Requirement Demonstrated |
|---|---|
| **Main Prize** | Full AI + PayPal integration, production-quality build |
| **AG Grid (\$5K)** | AG Grid Community v32, AI-driven filter, custom renderers |
| **Agentic Commerce (\$5K)** | Channel3 catalog, AI purchase proposal, PayPal modal |
| **Channel3 (\$1.5K)** | Channel3 REST API product search + fallback catalog |

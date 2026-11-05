# EterPay — Product Vision & Ecosystem Architecture

> **Tagline:** Your Money. Everywhere. Intelligently Connected.  
> **Target:** PayPal "Build What's Next with PayPal and AI" Global Hackathon 2026  
> **Classification:** Global AI-Powered Financial & Commerce Operating System

---

## 1. Executive Summary

Traditional financial experiences are fractured. A user pays with PayPal or a local rail, checks foreign exchange on Google, tracks their travel budget in spreadsheets, shops across disjointed online storefronts, and manages business invoices through separate accounting software.

**EterPay (Eternal Payments)** unifies these worlds into an intelligent, multi-currency financial ecosystem. It connects:
1. **Payments & Checkout (EterPay Pay):** Powered by server-side PayPal Orders v2, modal checkout, and asynchronous webhook verification.
2. **Financial Overview (EterPay Wallet):** Non-custodial aggregation of balances, transaction history, linked methods, and spending analytics.
3. **Merchant & Business Services (EterPay Business & Invoices):** Smart invoicing, sales analytics, subscription tracking, and payment link generation.
4. **Currency Intelligence (EterPay Global):** Real-time European Central Bank (ECB) reference rates, transparent fee calculations (0.4% platform vs 4.5% bank spread), and volatility alerts.
5. **Agentic Commerce (EterPay Commerce):** Multi-retailer product discovery with one-click payment cart preparation.
6. **Travel Finance (EterPay Anywhere):** Destination-aware budgeting, local currency conversion, and DCC markup protection.
7. **Educational Risk Modeling (EterPay Invest):** Scenario stress-testing of foreign currency exposures with permanent simulation badges.
8. **The Central Intelligence Layer (EterPay AI):** A multi-tier conversational copilot (Gemini 1.5 Flash + Groq Llama 3.3 70B fallback) that translates natural-language intents into structured, human-gated tool executions.

---

## 2. Core Architectural Pillars

### Pillar I: The Deterministic Safety Gate
The AI agent operates strictly as an **intent proposer**. It has zero autonomous authority to debit accounts or mark orders as paid.
$$\text{User Intent} \longrightarrow \text{AI Tool Proposal} \longrightarrow \text{Backend Validation} \longrightarrow \text{Explicit Human Approval} \longrightarrow \text{PayPal Orders API} \longrightarrow \text{Ledger Commit}$$

### Pillar II: Non-Custodial Transparency
EterPay is a financial orchestration platform, not a fractional-reserve bank or regulated broker. All fund transfers rely on licensed payment rails (PayPal Sandbox in hackathon; PayPal Production & authorized banking partners in production).

### Pillar III: High-Performance Data Surface (AG Grid Community v32)
Complex ledgers, invoice lists, multi-currency allocations, and dispute logs are rendered using AG Grid with in-cell SVG sparklines, custom status badges, and dynamic AI-driven filtering.

---

## 3. Persona & Role Model

EterPay supports three operational perspectives:
1. **Personal User:** Focuses on travel planning, cross-border shopping, peer transfers, and currency exposure.
2. **Merchant / Business User:** Accesses business sales summaries, invoice generation, customer billing, and dispute logs.
3. **Auditor / Administrator:** Monitors system health, webhook delivery status, idempotency logs, and compliance boundaries.

# Product Requirements Document (PRD) — EterPay

## 1. User Personas
* **The Outbound Traveler:** Needs destination currency breakdown (INR to JPY), travel budget allocation, and assistance purchasing travel gear under budget.
* **The Cross-Border Freelancer:** Holds multi-currency balances, tracks exchange-rate trends, and wants to understand true conversion fees before withdrawing.

## 2. Core Functional Requirements
* **FR-1 (Conversational Assistant):** Natural language parsing of budget, travel, and payment requests with tool calling.
* **FR-2 (PayPal Sandbox Payment):** Server-side order creation via Orders v2 API, client modal checkout via JS SDK, and capture.
* **FR-3 (AG Grid Financial Terminal):** Multi-currency portfolio display, in-cell sparklines, and dynamic AI-driven filtering.
* **FR-4 (Live Exchange Rates):** Real-time rates from Frankfurter ECB API with spread and fee transparency.
* **FR-5 (Agentic Commerce):** Semantic product search via Channel3 with one-click cart preparation.
* **FR-6 (Simulated Investment):** Currency scenario stress testing with what-if sliders.
* **FR-7 (Deterministic Safety Gate):** Human approval required before payment; strict limits enforced.

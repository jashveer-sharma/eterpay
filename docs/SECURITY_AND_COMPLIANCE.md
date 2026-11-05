# Security & Compliance Governance — EterPay

> **Financial Security, Anti-Injection Filters, PCI-DSS Boundaries, and Compliance Guardrails**  
> **Rule Scope:** Non-Negotiable Mandatory Architecture

---

## 1. Zero Client Secrets & PCI-DSS Boundaries
* **No Direct Card Data:** EterPay never stores, processes, or transmits Primary Account Numbers (PAN), CVVs, or cardholder credentials. All payment collection is delegated to the certified **PayPal JavaScript SDK v6 modal**.
* **Zero Secrets in Frontend:** PayPal Client Secret, Gemini API keys, Groq tokens, and database passwords reside strictly on the FastAPI backend and are injected via server environment variables.

---

## 2. Idempotency & Re-entry Protection
Every order creation request must include a UUIDv4 idempotency key passed via the `PayPal-Request-Id` HTTP header. This eliminates accidental double-charging during poor network conditions or aggressive retries.

---

## 3. Financial Ceiling Thresholds
Hard-coded safety limits prevent unauthorized high-value exposure in sandbox and production:
* Maximum single order amount: **₹25,000.00 INR** / **$300.00 USD**.
* Exceeding requests are rejected at the FastAPI schema level before invoking PayPal APIs.

---

## 4. Anti-Prompt Injection & Tool Isolation
* The language model has **zero direct SQL or database write permissions**.
* All tool outputs pass through strict **Pydantic v2 validation models**.
* System prompt guardrails instruct the model to refuse prompt extraction or role hijacking attempts.

---

## 5. Regulatory Badges & Simulation Disclosure
All investment simulation tools, portfolio tracking models, and macro FX stress-testing sliders carry permanent, prominent UI badges:
`[Simulated Portfolio — Educational Only — No Capital at Risk]`

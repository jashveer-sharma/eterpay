# AI Model Evaluation & Multi-Tier Architecture (Phase 8)

> **Document Status:** Active AI Strategy & Tool Registry  
> **Mandatory Policy:** Zero API charges. Zero autonomous money transfer. Strict Pydantic schema validation.

---

## 1. Free-Tier Model Comparison Matrix

| Evaluation Dimension | Primary: Google Gemini 1.5 Flash | Fallback: Groq Llama 3.3 70B | Deterministic Engine |
|---|---|---|---|
| **Host / Platform** | Google AI Studio (API) | Groq Cloud Console (LPU) | In-Memory Python / TypeScript |
| **Reasoning Quality** | 8.8 / 10 (Strong fintech reasoning) | 9.2 / 10 (High Llama 3.3 benchmark) | Deterministic (Exact logic) |
| **Function / Tool Calling** | 9.6 / 10 (Native tool use) | 9.1 / 10 (OpenAI-compatible tools) | Exact Pattern Matching |
| **Pydantic Structured JSON**| Excellent (Enforced output schema) | Excellent (JSON mode) | Exact Schemas |
| **Latency** | ~600ms - 900ms | **~250ms - 400ms (Blazing fast)** | **< 1ms (Instantaneous)** |
| **Context Window** | **1,000,000 tokens** | 128,000 tokens | Memory Bound |
| **Free Tier Quota** | **15 RPM / 1M TPM / 1,500 RPD** | **30 RPM / 12K TPM / 1,000 RPD** | **Unlimited (Zero Token Cost)** |
| **Role in EterPay** | **Primary AI Engine** | **Instant 429 Failover Router** | **Offline Hackathon Backup** |

---

## 2. Separation of Concerns: AI vs. Deterministic Code

```
┌───────────────────────────────────────────────┬───────────────────────────────────────────────┐
│              DETERMINISTIC CODE               │                 AI AGENT (LLM)                │
│             (Strict Backend Logic)            │            (Conversational Copilot)           │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ • Currency rate calculations (Frankfurter API)│ • Natural-language intent classification      │
│ • Spread savings math (0.4% vs 4.5% bank fee) │ • Multi-currency travel budget allocation     │
│ • Portfolio P&L calculations                  │ • Destination financial advice & warning tips │
│ • Single order limit checks (Max ₹25k / $300) │ • Semantic product matching via Channel3      │
│ • PayPal Order ID & Idempotency generation    │ • Constructing structured payment proposals   │
│ • PayPal capture execution & webhook verifying│ • Translating user prompts to AG Grid filters │
└───────────────────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## 3. Tool Calling Registry (Pydantic Schemas)

1. **`plan_travel_budget(destination, total_budget_inr)`**
   * Computes per-diem breakdown (Hotel 40%, Dining 30%, Transit 15%, Buffer 15%).
2. **`convert_currency(amount, from_curr, to_curr)`**
   * Fetches real ECB rate and calculates transparent savings.
3. **`search_products_channel3(query, max_budget_inr)`**
   * Searches universal catalog for travel gear.
4. **`prepare_payment_order(amount, currency, merchant_name, description)`**
   * Constructs an unexecuted `ActionProposal` requiring explicit human authorization.
5. **`update_grid_filter(column, filter_type, value)`**
   * Emits AG Studio filter models to dynamically alter the AG Grid UI.
6. **`simulate_fx_shock(currency, delta_percentage)`**
   * Computes portfolio stress tests without touching real assets.

---

## 4. Anti-Hallucination & Safety Guardrails
* **No Money Autonomy:** The LLM prompt explicitly commands: *"You have NO authority to capture payments or update balances. You must return an ActionProposal which the user must review and click to authorize."*
* **Numeric Sanitization:** All currency outputs are double-checked against the live ECB rate cache to ensure the model never invents fictitious exchange rates.

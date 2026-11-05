---
name: free-ai-orchestration
description: >-
  Multi-tier free model routing, tool calling, JSON schema enforcement, and zero-cost fail-safe
  strategies using Google Gemini 1.5 Flash and Groq Llama 3.3 70B in EterPay.
---

# Free AI Orchestration Skill

Use this skill when implementing conversational agents, tool calling, and fallback routing in EterPay without incurring API costs.

## 1. Multi-Tier Free Model Hierarchy
1. **Tier 1 (Primary):** Google Gemini 1.5 Flash (`gemini-1.5-flash`)
   * Source: Google AI Studio (`GEMINI_API_KEY`)
   * Free Quota: 15 Requests/Min, 1,000,000 Tokens/Min, 1,500 Requests/Day
   * Strengths: Exceptional function calling, structured JSON output, fast execution.
2. **Tier 2 (Fallback):** Groq Llama 3.3 70B (`llama-3.3-70b-versatile`)
   * Source: Groq Cloud Console (`GROQ_API_KEY`)
   * Free Quota: 30 Requests/Min, 12,000 Tokens/Min, 1,000 Requests/Day
   * Trigger: Automatically routes here on HTTP 429 (`RESOURCE_EXHAUSTED`) from Gemini.
3. **Tier 3 (Offline Rule Engine):**
   * Deterministic regex and financial math functions for basic FX calculations and budget breakdowns when offline.

## 2. Pydantic Tool Definitions
All tools exposed to the LLM must be defined using strict Pydantic v2 schemas:
* `ConvertCurrencyTool(amount, from_curr, to_curr)`
* `SearchProductsTool(query, max_price)`
* `PreparePaymentOrderTool(amount, currency, merchant_name, description)`
* `UpdateGridFilterTool(filter_column, filter_value)`
* `SimulateFXShockTool(target_currency, delta_percentage)`

## 3. Human-in-the-Loop Protocol
* The LLM **never** captures payments or mutates the live ledger directly.
* Tool calls that propose payments return a `PROPOSAL_PENDING_APPROVAL` status.
* The UI renders a high-contrast Action Card with the converted amounts and fees.
* Execution only occurs when the user clicks the official PayPal Checkout button.

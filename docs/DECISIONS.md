# Architectural Decision Records (ADR) — EterPay

## ADR-001: Project Identity & Brand
* **Decision:** Rebrand to **EterPay** (*Eternal Payments*).
* **Rationale:** Discovered major prior-use trademark conflicts for "Unipay" in India (Class 36) and Europe.

## ADR-002: Scope Pruning (No Speculative Forex Trading)
* **Decision:** Replace open retail forex trading with educational scenario simulation.
* **Rationale:** FEMA and RBI regulations strictly forbid unauthorized retail forex trading (RBI Alert List).

## ADR-003: Multi-Tier Free AI Strategy
* **Decision:** Primary AI = Google Gemini 1.5 Flash; Secondary Fallback = Groq Llama 3.3 70B.
* **Rationale:** Zero API subscription costs; robust tool-calling support; eliminates single-point-of-failure rate limit errors during judging.

## ADR-004: AG Grid as Command Terminal
* **Decision:** Implement AG Grid with sparklines and AI-driven dynamic filtering hooks.
* **Rationale:** Capitalizes on AG Grid's $5,000 platform deployment sponsor prize and provides enterprise-grade fintech UX.

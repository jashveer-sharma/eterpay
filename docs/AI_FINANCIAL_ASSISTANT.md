# EterPay AI — Central Financial Intelligence Layer

> **Multi-Tier Free-Model Routing & Tool Calling Architecture**  
> **Primary:** Google Gemini 1.5 Flash (Google AI Studio)  
> **Fallback:** Groq Cloud Llama 3.3 70B Versatile  
> **Failsafe:** Deterministic Rule Engine (Zero external dependencies)

---

## 1. Architectural Philosophy

EterPay AI is not a generic conversational chatbot. It is a **context-aware financial tool operator** embedded directly into the workspace. It understands user intentions, queries live APIs, proposes structured financial actions, and drives the UI state (such as filtering AG Grid tables or preparing PayPal checkouts).

```
┌────────────────────────────────────────────────────────┐
│                   User Natural Language                │
│    "Plan my Tokyo trip with ₹1,50,000" / "Filter AG Grid"│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               AIAgentOrchestrator Router               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Tier 1: Gemini 1.5 Flash (15 RPM Free Tier)      │  │
│  │   • Tools: convert_currency, search_products,    │  │
│  │     plan_travel_budget, update_grid_filter       │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │ On 429 / Timeout           │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ Tier 2: Groq Llama 3.3 70B (30 RPM Free Tier)    │  │
│  │   • OpenAI-compatible Tool Calling JSON format   │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │ On Network Failure         │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ Tier 3: Deterministic NLP Rule Engine            │  │
│  │   • Regex & Token Matching for 100% Hackathon    │  │
│  │     demonstration reliability                    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Parameterized Tool Definitions

### 1. `convert_currency`
* **Purpose:** Queries live European Central Bank (ECB) exchange rates via Frankfurter.
* **Arguments:** `amount: float`, `from_currency: str`, `to_currency: str`.
* **Output:** Precise converted amount, reference rate, and transparent fee comparison (0.4% platform rate vs traditional 4.5% bank spread).

### 2. `search_products_channel3`
* **Purpose:** Queries Channel3 product graph for travel essentials and hardware.
* **Arguments:** `query: str` (e.g. "travel adapter", "luggage", "eSIM").
* **Output:** Product card with INR and USD pricing, retailer info, and a one-click checkout preparation proposal.

### 3. `plan_travel_budget`
* **Purpose:** Constructs destination-aware financial breakdown and currency allocation.
* **Arguments:** `destination: str` (e.g. Tokyo, Paris, Dubai, Singapore), `budget_inr: float`.
* **Output:** Recommended budget allocation (40% Accommodation, 30% Dining, 15% Transit, 15% Buffer), DCC warning pro-tips, and a volatility alert proposal.

### 4. `update_grid_filter`
* **Purpose:** Dynamically controls AG Grid filter models from natural language.
* **Arguments:** `column: str` (e.g. "category", "status"), `value: str` (e.g. "Travel", "Dining").
* **Output:** Dispatches `setFilterModel()` event directly into the AG Grid React component.

---

## 3. Grounding & Anti-Hallucination Guarantees
* **No Invented Numbers:** Exchange rates come strictly from Frankfurter ECB responses.
* **No Faked Transactions:** AI never emits a "Transaction Paid" status; it only emits an `ActionProposal` requiring user approval.
* **Context Preservation:** Up to 8 previous conversation turns are retained in session state, enabling progressive clarifications (e.g., "Now convert that into euros").

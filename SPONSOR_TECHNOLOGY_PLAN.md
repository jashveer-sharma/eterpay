# Sponsor Technology Plan & Prize Optimization (Phase 7)

> **Document Status:** Hackathon Sponsor Technology Strategy  
> **Target Prize Categories:** Best Use of AG Grid ($5K), Best Use of Agentic Commerce ($5K), Best Use of Channel3 ($1.5K), Best Use of APIMatic ($1K), Best Use of PayPal + AI ($5K).

---

## 1. Prioritized Sponsor Technology Roster

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SPONSOR STACK & PRIZE MAPPING                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. AG GRID & AG STUDIO (Highest Prize Leverage):                       │
│    • Target: "Best Use of AG Grid - 1st Place" ($5,000 cash)           │
│    • Role: Multi-currency balance grid, in-cell sparkline charts,      │
│      transaction audit ledger, and AI-driven dynamic filtering hook.   │
│                                                                        │
│ 2. CHANNEL3 (High Prize Leverage):                                     │
│    • Target: "Best Use of Channel3" ($1,500) + "Agentic Commerce" ($5K│
│    • Role: Natural-language product discovery feeding into PayPal.     │
│                                                                        │
│ 3. APIMATIC (High Value Dev Tool):                                     │
│    • Target: "Best Use of APIMatic" (3× $1,000 cash)                   │
│    • Role: Context Plugin used in coding agents to eliminate PayPal    │
│      REST API parameter hallucinations.                                │
│                                                                        │
│ 4. RENDER (Infrastructure):                                            │
│    • Target: "Best Use of Render" ($1,000 Cloud Credits)               │
│    • Role: Hosts the mandatory public demo URL via render.yaml.        │
│                                                                        │
│ 5. POSTMAN (Developer Experience):                                     │
│    • Target: Judge Technical Score Booster                             │
│    • Role: Public Postman Workspace & collection for PayPal Orders API.│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Deep Dive: AG Grid Implementation Architecture

AG Grid is the centerpiece of the EterPay financial terminal. Rather than treating it as a generic table, EterPay implements:

### A. Community vs. Enterprise Feature Allocation
* **AG Grid Community (Free / MIT):**
  * Core grid virtualization (handles 100,000+ rows with zero lag).
  * Column sorting, resizing, pinnable columns, and quick filter search.
  * Custom Cell Renderers: Neon green status badges, currency icons, PayPal transaction deep-links.
* **AG Grid Enterprise (Hackathon Free Trial):**
  * **In-Cell Mini Sparklines:** Displays a 7-day SVG exchange-rate trend line directly inside the currency column without clicking into sub-pages.
  * **Integrated Charts:** Generates instant asset distribution pie/bar charts directly from grid row data.

### B. The AG Studio Agent Framework Hook
In accordance with PayPal and AG Grid's hackathon guidelines (`paypaldev/hackathon-paypal-ag-grid-boilerplate`):
* When the user prompts the AI: *"Show only travel expenses over ₹5,000"*, the AI agent executes:
  ```json
  {
    "tool": "update_grid_filter",
    "params": {
      "category": { "filterType": "text", "type": "equals", "filter": "Travel" },
      "amount": { "filterType": "number", "type": "greaterThan", "filter": 5000 }
    }
  }
  ```
* The frontend grid subscribes to this state and calls `gridApi.setFilterModel()`, providing a seamless natural-language interface to financial data.

---

## 3. Evaluation of Secondary Sponsor Tools

| Sponsor | Capability | Verdict for EterPay | Justification |
|---|---|---|---|
| **Elastic** | Vector & Hybrid Search | ⚪ **Optional RAG** | High setup overhead for a 7-day sprint; SQLite/Postgres handles transaction indexing effectively. |
| **Bryntum** | Gantt & Timeline Schedulers | ⚪ **Pruned** | Specialized for project scheduling; AG Grid is far better suited for financial ledgers. |
| **Astropods** | Agent Runtime OS | ⚪ **Pruned** | Replaced by lightweight native Python LangGraph orchestrator to maintain low memory usage on 4GB RAM host. |
| **KERNEL** | Cloud Browser Automation | ⚪ **Pruned** | Not required since Channel3 provides structured REST APIs without fragile browser scraping. |
| **Zapier** | No-Code Automation | ⚪ **Optional Post-Hackathon** | Nice for external CRM webhooks, but PayPal Webhook handler in FastAPI is cleaner. |

---
name: ag-grid-fintech
description: >-
  Best practices for configuring high-performance AG Grid tables, custom cell renderers, sparkline mini-charts,
  and dynamic AI agent filtering (AG Studio pattern) in EterPay.
---

# AG Grid Fintech Implementation Skill

Use this skill when designing, styling, and integrating AG Grid into the EterPay dashboard.

## 1. Grid Packages & Dependencies
* `@ag-grid-community/react`
* `@ag-grid-community/core`
* Theme: `ag-theme-quartz-dark` customized with EterPay colors:
  * Grid background: `#090A0F`
  * Row hover: `#141721`
  * Accent color: `#00E676`

## 2. Key Grid Implementations in EterPay
1. **Multi-Currency Portfolio Grid:**
   * Columns: Currency (`INR`, `USD`, `EUR`, `JPY`), Balance, Exchange Rate, 24h Change %, 7-Day Sparkline.
   * Cell Renderer: Mini inline SVG sparklines for exchange rate volatility.
2. **Transaction Audit Ledger:**
   * Columns: Date, PayPal Order ID, Description, Category, Amount Source, Amount Target, Status badge.
   * Status Badge Renderers: `COMPLETED` (Neon Green pill), `PENDING` (Amber pill), `FAILED` (Crimson pill).

## 3. Natural Language Filter Hook (AG Studio Agent Pattern)
When the AI agent receives requests like *"Show only travel expenses over ₹2,000"*:
1. Agent emits `UpdateGridFilterTool({ column: 'category', value: 'Travel' })`.
2. Frontend receives the structured tool payload and calls:
   `gridApi.setFilterModel({ category: { filterType: 'text', type: 'equals', filter: 'Travel' } })`.
3. The grid instantly updates without a full page reload or network query.

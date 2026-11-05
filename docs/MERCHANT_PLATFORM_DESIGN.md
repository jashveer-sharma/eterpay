# EterPay Business — Merchant Platform & Invoicing Architecture

> **Business Operations, Invoicing, and Merchant Analytics**  
> **API Integration:** PayPal Invoicing v2 + Orders v2 + AG Grid Community v32

---

## 1. Overview & Business Persona

EterPay Business extends the financial platform for freelancers, digital creators, and cross-border merchants. It provides:
1. **Smart Conversational Invoicing:** Natural-language invoice drafting.
2. **Payment Link Generation:** One-click hosted payment URLs.
3. **AG Grid Sales Ledger:** High-density transaction tables with sorting, filtering, and volume summaries.
4. **AI Revenue Intelligence:** Conversational sales analysis and weekly comparison.

---

## 2. Invoicing Workflow (PayPal Invoicing v2 Equivalent)

```
[ Natural Language Instruction ]
"Create an invoice for ₹15,000 for Acme Corp for UI design services due in 14 days"
       │
       ▼
[ AI Structured Invoice Parser ]
{
  "invoice_number": "INV-2026-0042",
  "client_name": "Acme Corp",
  "items": [
    {"description": "UI Design Services", "quantity": 1, "unit_price": 15000.0}
  ],
  "currency": "INR",
  "total": 15000.0,
  "due_date": "2026-11-19"
}
       │
       ▼
[ Merchant Review & Send ]
Merchant confirms invoice details.
Status initialized to `PENDING`.
Sharable payment link generated via EterPay Pay.
```

---

## 3. Role-Based User Persona Switcher

The EterPay top navigation provides an instant toggle between:
* **Personal Mode:** Focuses on travel budgets, personal cards, FX calculator, and consumer shopping.
* **Business Mode:** Replaces personal balances with **Gross Sales**, **Pending Invoices**, **Dispute Rate**, and **AG Grid Merchant Sales Ledger**.

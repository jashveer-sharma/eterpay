# Payment Flow Design & Deterministic Safety Gate — EterPay

> **Financial Safety, Idempotency, and Verification Architecture**  
> **Rule:** Never fake payment confirmations. AI never transfers funds directly.

---

## 1. The 6-Step Deterministic Payment Gate

```
[ Step 1: Conversational Intent ]
User: "Buy the universal travel adapter for $17.80"
  │
  ▼
[ Step 2: AI Action Proposal ]
AIAgentOrchestrator generates structured ActionProposal:
{
  "type": "PAYPAL_CHECKOUT",
  "amount": 17.80,
  "currency": "USD",
  "requires_approval": true
}
  │
  ▼
[ Step 3: Backend Safety Validation ]
SafetyEngine.validate_order_limits(amount=17.80, currency="USD")
  • Verifies amount <= MAX_SINGLE_ORDER_USD ($300.00)
  • Enforces UUIDv4 Idempotency Key
  │
  ▼
[ Step 4: Explicit Human Approval Click ]
User reviews merchant, price, and currency in the Hallmark Smoked Glass Card.
User clicks official PayPal JavaScript SDK "Pay with PayPal" button.
  │
  ▼
[ Step 5: Server-Side PayPal Orders v2 Execution ]
FastAPI backend invokes:
`POST https://api-m.sandbox.paypal.com/v2/checkout/orders`
  • Header: `PayPal-Request-Id: <UUIDv4>`
  • Intent: `CAPTURE`
  • Modal renders PayPal Sandbox Buyer login
  │
  ▼
[ Step 6: Capture & Asynchronous Webhook Verification ]
User approves inside PayPal modal:
  • Client executes `capture_order(order_id)` via FastAPI backend
  • Backend receives PayPal Order `status: "COMPLETED"`
  • Webhook listener logs `PAYMENT.CAPTURE.COMPLETED`
  • Record committed to AG Grid audit ledger with status `CAPTURED`
```

---

## 2. Idempotency & Re-entry Protection
Network interruptions must never cause double charging.
Every order creation request must generate a unique UUIDv4 idempotency key passed via `PayPal-Request-Id`. If the client retries the request with the identical key, PayPal returns the existing order rather than creating a duplicate.

---

## 3. Financial Limits Enforcement
The backend strictly enforces ceiling thresholds in `app/core/safety.py`:
* **Max Single Order INR:** ₹25,000.00
* **Max Single Order USD:** $300.00
Requests exceeding these thresholds trigger an immediate HTTP 400 rejection:
`"Order amount {amount} {currency} exceeds maximum safety threshold."`

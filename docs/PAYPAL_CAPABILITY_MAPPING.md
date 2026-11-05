# PayPal Capability Mapping — EterPay

> **Comparative API Mapping & Differentiation Matrix**  
> How EterPay leverages, augments, and differentiates from PayPal Developer APIs.

---

## 1. Customer-Facing Payment Capabilities

| PayPal Capability | PayPal Developer API | EterPay Equivalent | Differentiating AI / Ecosystem Enhancement | Implementation Status |
|---|---|---|---|---|
| **Online Checkout** | Orders v2 API (`POST /v2/checkout/orders`) | **EterPay Pay Checkout** | AI prepares checkout parameters from conversation; human clicks explicit "Approve" | `PAYPAL SANDBOX` (Fully Working) |
| **In-App Modal Payment** | `@paypal/react-paypal-js` | **EterPay Modal Gate** | Embedded inside Hallmark Dusk glass card; never leaves the workspace | `PAYPAL SANDBOX` (Fully Working) |
| **Peer-to-Peer Transfer** | PayPal P2P Transfers / Send Money | **EterPay P2P Send** | Natural language recipient parsing (`Send ₹2,500 to Rahul`) with fee breakdown | `SIMULATED` (Mock Data Flow) |
| **Payment Requests** | PayPal Request Money | **EterPay Money Request** | Generates sharable request link with transparent FX rates | `PAYPAL SANDBOX` (Link Generator) |
| **Transaction Activity** | Activity & Receipts API | **EterPay AG Grid Ledger** | High-performance AG Grid Community v32 with dynamic AI natural language filtering | `REAL INTEGRATION` (AG Grid + Local State) |

---

## 2. Merchant & Business Capabilities

| PayPal Capability | PayPal Developer API | EterPay Equivalent | Differentiating AI / Ecosystem Enhancement | Implementation Status |
|---|---|---|---|---|
| **Invoicing** | Invoicing v2 API (`/v2/invoicing/invoices`) | **EterPay Smart Invoicing** | Conversational prompt generates full multi-item invoice; auto-calculates taxes and due dates | `PAYPAL SANDBOX` / `SIMULATED` |
| **Subscriptions & Billing** | Subscriptions v1 API (`/v1/billing/subscriptions`) | **EterPay Subscriptions** | AI analyzes recurring spending and flags price increases or unused services | `PLANNED` (P2 Scope) |
| **Dispute Management** | Disputes v1 API (`/v1/customer/disputes`) | **EterPay Protection** | AI structures buyer dispute narrative and compiles evidence package for review | `SIMULATED` (Sample Dispute UI) |
| **Batch Payouts** | Payouts v1 API (`/v1/payments/payouts`) | **EterPay Payouts** | Batch disbursement verification with two-factor human authorization | `REQUIRES PARTNER OR REGULATORY APPROVAL` |

---

## 3. Developer & Integration Infrastructure

| PayPal Capability | PayPal Developer API | EterPay Equivalent | Implementation Mechanism |
|---|---|---|---|
| **OAuth2 Token Exchange** | `POST /v1/oauth2/token` | `PayPalClient.get_access_token()` | Server-side HTTP Basic Auth; client secrets never exposed to frontend |
| **Idempotency Control** | `PayPal-Request-Id` Header | `SafetyEngine.ensure_idempotency_key()` | Enforced UUIDv4 on all order creation calls to prevent double charging |
| **Webhooks Engine** | `POST /api/paypal/webhook` | `paypal_webhook_listener` | Asynchronous capture verification for `PAYMENT.CAPTURE.COMPLETED` |

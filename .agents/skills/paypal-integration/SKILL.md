---
name: paypal-integration
description: >-
  Expert guidance for implementing the PayPal Orders v2 API, PayPal JavaScript SDK v6 modal checkout,
  asynchronous webhook handling, and sandbox testing for the EterPay project.
---

# PayPal Integration Skill (EterPay)

Use this skill when implementing, testing, or debugging PayPal payment flows in EterPay.

## 1. Authentication & Base URLs
* **Sandbox Base URL:** `https://api-m.sandbox.paypal.com`
* **Production Base URL:** `https://api-m.paypal.com`
* **OAuth2 Token Endpoint:** `POST /v1/oauth2/token`
  * Headers: `Authorization: Basic base64(client_id:client_secret)`
  * Body: `grant_type=client_credentials`

## 2. Orders v2 Lifecycle
1. **Create Order:** `POST /v2/checkout/orders`
   * Always include `PayPal-Request-Id: <UUIDv4>` header for idempotency.
   * Body must specify `intent: "CAPTURE"` and `purchase_units` with currency, amount, and itemized breakdown.
2. **Client Approval:** Handled via `@paypal/react-paypal-js` `PayPalButtons`.
   * Never store client secrets on frontend. Only provide `clientId`.
3. **Capture Order:** `POST /v2/checkout/orders/{id}/capture`
   * Executed from the FastAPI backend upon receiving client `onApprove`.
   * Verify status equals `"COMPLETED"`.

## 3. Webhook Verification
* **Target Event:** `PAYMENT.CAPTURE.COMPLETED`
* **Verification:** Use PayPal's webhook verification API or validate transmission headers (`PAYPAL-TRANSMISSION-SIG`, `PAYPAL-CERT-URL`, `PAYPAL-TRANSMISSION-TIME`) before committing to the transaction ledger.

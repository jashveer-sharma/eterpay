# QR Payment Architecture & Universal Decoder — EterPay Anywhere

> **EMVCo, UPI, and Regional QR Code Specification & Parsing Pipeline**

---

## 1. Supported QR Specifications & Standards

### A. EMVCo Merchant-Presented QR Code Specification
* **Specification Authority:** EMVCo QR Code Specification for Payment Systems (QRCPS).
* **Structure:** Type-Length-Value (TLV) encoded string formatted as:
  * Tag `00`: Format Indicator (e.g. `01` for Version 1).
  * Tag `01`: Point of Initiation Method (`11` for static, `12` for dynamic).
  * Tag `26`–`51`: Merchant Account Information (e.g. Visa, Mastercard, JCB, or Domestic Rail).
  * Tag `52`: Merchant Category Code (MCC).
  * Tag `53`: Transaction Currency Code (ISO 4217 numeric, e.g. `392` for JPY, `356` for INR, `840` for USD).
  * Tag `54`: Transaction Amount.
  * Tag `58`: Country Code (ISO 3166-1 alpha-2, e.g. `JP`, `SG`, `FR`).
  * Tag `59`: Merchant Name.
  * Tag `60`: Merchant City.
  * Tag `63`: CRC-16 Checksum (e.g. `6304ABCD`).

### B. NPCI UPI QR Specification
* **Format:** URI-based string:
  ```
  upi://pay?pa=merchant@icici&pn=TokyoSpiceShop&mc=5812&am=1200&cu=INR&tn=Dinner
  ```
* **Parameters:** `pa` (VPA handle), `pn` (Payee name), `mc` (MCC), `am` (Amount), `cu` (Currency).

### C. Singapore PayNow & SGQR
* **Format:** EMVCo-compliant unified QR label containing AID `A000000727` for Singapore PayNow linkage.

### D. Japan JPQR
* **Format:** Payments Japan Association unified merchant QR standard aggregating PayPay, Line Pay, and Rakuten Pay.

---

## 2. EterPay Anywhere QR Parsing Pipeline

```
[ Raw Scanned String ]
       │
       ├── Starts with `upi://pay?` ──────────► [ UPI URI Parser ]
       │                                            │
       │                                            ▼
       │                                     { rail: "UPI", vpa: "...", currency: "INR" }
       │
       ├── Starts with `000201` ──────────────► [ EMVCo TLV Parser ]
       │                                            │
       │                                            ▼
       │                                     {
       │                                       rail: "EMVCO_MERCHANT",
       │                                       mcc: "5812",
       │                                       country: "JP",
       │                                       currency: "JPY",
       │                                       amount: 8500
       │                                     }
       │
       └── Starts with `https://www.paypal.com`► [ PayPal Payment Link Parser ]
                                                    │
                                                    ▼
                                             { rail: "PAYPAL", orderId: "..." }
```

---

## 3. Merchant Compatibility Check & Route Suggestion

Once the QR payload is parsed into normalized fields:
```json
{
  "merchant_name": "Ichiran Ramen Shibuya",
  "destination_country": "JP",
  "requested_amount": 1200.0,
  "requested_currency": "JPY",
  "suggested_routes": [
    {
      "provider_id": "PRV-PAYPAL-V2",
      "rail_name": "PayPal Sandbox Checkout",
      "status": "ELIGIBLE",
      "conversion_rate": 0.01188,
      "inr_equivalent": 101.01,
      "is_live_sandbox": true
    },
    {
      "provider_id": "PRV-NIPL-UPI",
      "rail_name": "UPI International at Partner Terminal",
      "status": "SIMULATED_DEMO",
      "is_live_sandbox": false
    }
  ]
}
```
The user reviews the converted amount and approves the payment via the verified PayPal Sandbox modal.

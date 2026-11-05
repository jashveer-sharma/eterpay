# Payment Provider & Capability Registry — EterPay Anywhere

> **Central Dynamic Directory of Connected Payment Rails, Networks, and Regional Eligibility**

---

## 1. Provider Registry Schema

```json
{
  "provider_id": "PRV-PAYPAL-SANDBOX",
  "name": "PayPal Orders v2",
  "category": "INTERNATIONAL_PSP",
  "supported_countries": ["US", "GB", "EU", "IN", "JP", "SG", "AE", "AU", "CA"],
  "settlement_currencies": ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "SGD"],
  "supported_flows": ["ONLINE_CHECKOUT", "MODAL_GATE", "INVOICE", "REFUND"],
  "auth_type": "OAUTH2_BEARER",
  "sandbox_available": true,
  "live_integration_status": "PAYPAL_SANDBOX",
  "adapter_class": "PayPalOrdersAdapter"
}
```

---

## 2. Active Provider Registry

| Provider ID | Provider Name | Primary Rails | Currencies | Availability | Status in EterPay |
|---|---|---|---|---|---|
| `PRV-PAYPAL-V2` | **PayPal Orders v2** | Visa, Mastercard, Amex, PayPal Balance | 25+ Global (USD, EUR, GBP, JPY, etc.) | Global (200+ markets) | `PAYPAL SANDBOX` (Live & Verified) |
| `PRV-NIPL-UPI` | **NPCI NIPL (UPI Intl)** | IMPS, Indian Bank Accounts | INR, JPY, EUR, AED, SGD | France, UAE, Singapore, Mauritius, Nepal | `SIMULATED` (Sample Parser & Fee Engine) |
| `PRV-ALIPAY-PLUS` | **Alipay+ Global** | Regional Asian Wallets | USD, EUR, JPY, SGD | Asia-Pacific, Europe | `SIMULATED` (Travel Routing Demonstration) |
| `PRV-EMVCO-CARD` | **EMVCo Card Network** | Visa, Mastercard, JCB | Global ISO 4217 | Global | `SIMULATED` (Non-custodial Gateway Router) |
| `PRV-PIX-BCB` | **Pix Brazil** | Central Bank of Brazil SPI | BRL | Brazil | `PLANNED` (Stage 3 Integration) |

---

## 3. Country & Currency Compatibility Matrix

| User Country | Destination Country | Accepted Rail | Settlement Currency | Conversion Provider | Route Recommendation |
|---|---|---|---|---|---|
| **India (`IN`)** | **Japan (`JP`)** | PayPal Sandbox / PayPay QR | `JPY` | ECB via Frankfurter | Direct JPY checkout via PayPal Orders v2 |
| **India (`IN`)** | **France (`FR`)** | NIPL UPI / PayPal | `EUR` | ECB via Frankfurter | UPI International at partner POS / PayPal modal |
| **India (`IN`)** | **UAE (`AE`)** | Aani / NEOPAY / PayPal | `AED` | ECB via Frankfurter | PayPal Sandbox modal with AED/INR rate breakdown |
| **USA (`US`)** | **India (`IN`)** | PayPal Global / SWIFT | `INR` | ECB via Frankfurter | PayPal Checkout with transparent INR spread |
| **Germany (`DE`)**| **Singapore (`SG`)**| PayNow / PayPal | `SGD` | ECB via Frankfurter | PayPal modal with SGD/EUR conversion |

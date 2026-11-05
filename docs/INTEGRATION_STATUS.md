# Integration Status — EterPay

| Integration | Target | Status | Verification Method |
|---|---|---|---|
| **PayPal Orders API** | Sandbox | Configured | OAuth2 token generation & Order creation |
| **PayPal JS SDK** | Client Modal | Configured | Sandbox test buyer account login |
| **AG Grid** | Dashboard | Configured | Render multi-currency rows with sparklines |
| **Frankfurter ECB API** | Live Rates | Verified | `https://api.frankfurter.app/latest?from=INR` |
| **Channel3 API** | Product Search | Configured | Promo code `PAYPAL-platform deployment-2026` + local fallback |
| **Gemini 1.5 Flash** | AI Engine | Configured | Tool-calling test with `ConvertCurrencyTool` |
| **Groq Llama 3.3 70B**| Fallback AI | Configured | Automatic fallback routing on 429 status |
| **Render Cloud** | Deployment | Configured | `render.yaml` infrastructure-as-code |

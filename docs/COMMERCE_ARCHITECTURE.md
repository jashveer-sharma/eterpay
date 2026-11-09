# EterPay Commerce — Agentic Commerce Architecture

> **AI-Assisted Shopping, Product Graph Discovery, and PayPal Modal Checkout**  
> **API Integration:** Channel3 REST API (`https://api.channel3.ai`) + Curated Fallback Catalog + PayPal Orders v2

---

## 1. Overview & System Flow

EterPay Commerce connects destination discovery with cross-border shopping. When an international traveler plans a trip, the system proactively discovers essential travel gear, verifies pricing in local currency, and prepares a one-click checkout cart backed by PayPal Sandbox.

```
┌────────────────────────────────────────────────────────┐
│             User Prompt / Destination Selection        │
│          "Traveling to Tokyo" / "Find travel adapter"   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Channel3 Product Discovery Engine         │
│  • Primary: `GET https://api.channel3.ai/v1/search`   │
│  • Fallback: Curated Local Product Catalog (Anker,     │
│    Airalo, Peak Design, Nomatic)                       │
│  • Normalizes prices to INR and USD                    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Product Card Presentation                 │
│  • Title, Image, Rating, Retailer, Dual Currency Price │
│  • "Prepare Checkout" Action                           │
└───────────────────────────┬────────────────────────────┘
                            │ User Clicks "Prepare Checkout"
┌───────────────────────────▼────────────────────────────┐
│           Deterministic Payment Gate Card              │
│  • Injects into AI Copilot                             │
│  • Mounts `@paypal/react-paypal-js` Smart Button       │
│  • Triggers PayPal Orders v2 Sandbox Checkout          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Verified Fallback Product Catalog
To ensure 100% demo reliability during live platform deployment judging, the backend includes an offline catalog in `app/api/endpoints/commerce.py`:
1. **Anker Universal Travel Adapter:** Type A Japanese Pins, 65W GaN charging, ₹1,499 INR ($17.80 USD).
2. **Airalo Japan eSIM 10GB:** 30-day SoftBank LTE data, ₹1,250 INR ($14.90 USD).
3. **Peak Design Tech Pouch:** Weatherproof recycled nylon, ₹4,999 INR ($59.50 USD).

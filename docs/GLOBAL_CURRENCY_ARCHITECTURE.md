# Global Currency Architecture & Exchange Intelligence — EterPay

> **European Central Bank Reference Rates & Transparent Fee Modeling**  
> **Source:** Frankfurter API (`https://api.frankfurter.app`) · **Regulatory Classification:** Informational & Reference Only

---

## 1. Exchange Rate Sourcing & In-Memory Caching

EterPay leverages the **Frankfurter API**, which tracks reference exchange rates published by the **European Central Bank (ECB)** every working day around 16:00 CET.

```
Frontend / Client Request
       │
       ▼
CurrencyClient.get_latest_rates(base="INR")
       │
       ├── Cache Hit (< 3600s TTL) ────────► Return cached ECB rates
       │
       └── Cache Miss / Expired
              │
              ├── Query `https://api.frankfurter.app/latest?from=INR`
              │     │
              │     ├── 200 OK ─────────────► Cache rates & return
              │     │
              │     └── Error / Timeout ────► Fall back to offline reference rates
```

### Cache Invariant
Exchange rates are cached in memory for **3600 seconds (1 hour)** in `app/core/currency_client.py`. This avoids excessive external network calls while ensuring rates remain accurate within daily ECB publication cycles.

---

## 2. Transparent Fee Modeling

Standard commercial banks and credit card networks charge substantial hidden fees during cross-border transactions:
* **Dynamic Currency Conversion (DCC) Markups:** 3.5% to 5.5% added at POS terminals or ATMs.
* **Foreign Transaction Fees:** 1.5% to 3.5% added by card issuers.

### EterPay Calculation Formula
$$\text{Traditional Bank Markup} = \text{Amount} \times 0.042 \quad (4.2\%)$$
$$\text{EterPay Platform Fee} = \text{Amount} \times 0.004 \quad (0.4\%)$$
$$\text{User Savings} = \text{Traditional Fee} - \text{EterPay Fee}$$

Every conversion display in EterPay shows this breakdown transparently, illustrating the exact savings compared to traditional bank cards.

---

## 3. Strict Regulatory Distinctions

EterPay clearly differentiates between five distinct financial concepts:

1. **Exchange-Rate Information:** Public ECB reference rates provided for educational and estimation purposes.
2. **Payment Provider Conversion:** The actual conversion rate applied by PayPal during cross-border checkout.
3. **Currency Exposure:** The proportion of simulated or tracked balances held in foreign currencies.
4. **Simulated Currency Investments:** Educational what-if scenarios (P&L and stress testing) clearly labeled with simulation badges.
5. **Regulated Foreign Exchange Trading:** Leveraged speculative forex trading, which EterPay does **not** provide.

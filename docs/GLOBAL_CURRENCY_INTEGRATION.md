# Global Currency Integration & Rate Disclosures — EterPay Anywhere

> **European Central Bank Reference Feeds, Caching Rules, and Conversion Disclosures**

---

## 1. Rate Synchronization Mechanism

* **Provider:** European Central Bank via Frankfurter API (`https://api.frankfurter.app/latest?from=INR`).
* **Update Frequency:** Daily ECB release around 16:00 CET.
* **In-Memory Cache TTL:** 3,600 seconds (1 hour) stored in `app/core/currency_client.py`.
* **Zero Cost / Zero Secret:** Operates 100% free with no commercial API key required.

---

## 2. Mandatory Rate Disclosures to Users

EterPay enforces a non-negotiable legal and UX disclosure on every currency display:

> **Important Exchange Rate Disclosure:**  
> The exchange rates displayed in EterPay are reference rates published by the European Central Bank (ECB) and are provided strictly for informational and comparison purposes. Actual cross-border conversions executed via payment partners (such as PayPal) may incorporate partner-specific conversion spreads, card network rates, or cross-currency handling fees.

---

## 3. Multi-Currency Ledger Mapping

Transactions stored in the AG Grid audit ledger maintain three distinct currency fields:
1. `source_amount` & `source_currency`: What the user funded (e.g. `₹1,250 INR`).
2. `target_amount` & `target_currency`: What the merchant received (e.g. `$14.90 USD`).
3. `ecb_reference_rate`: The interbank benchmark rate at transaction time (e.g. `0.01188`).

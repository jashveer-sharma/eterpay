# Global Payment Network Research — Technical & Regulatory Audit

> **Comprehensive Investigation of Payment Rails, Developer APIs, Licensing, and Regional Boundaries**  
> *Every integration is evaluated against real developer documentation, licensing prerequisites, and technical feasibility.*

---

## 1. International Payment Providers

### A. PayPal (Core platform deployment Integration)
* **Official Documentation:** [https://developer.paypal.com/docs/api/overview/](https://developer.paypal.com/docs/api/overview/)
* **Relevant APIs:** Orders v2 API (`/v2/checkout/orders`), Payments v2 (`/v2/payments/captures`), Webhooks v1, Invoicing v2.
* **Verified Capabilities:** Server-side order creation, modal approval via `@paypal/react-paypal-js`, asynchronous capture, webhook HMAC verification.
* **Geographic Availability:** 200+ markets, 25+ settlement currencies.
* **Account Requirements:** Developer Sandbox account (Free); Business account for production.
* **Sandbox Availability:** **Fully functional (Live in EterPay)**.
* **Regulatory & Licensing:** Licensed Money Transmitter (US FinCEN), Electronic Money Institution (CSSF Luxembourg / FCA UK).
* **Technical Feasibility:** **100% Verified & Implemented (`P0`)**.

### B. Visa (Visa Direct & CyberSource)
* **Official Documentation:** [https://developer.visa.com/capabilities/visa_direct](https://developer.visa.com/capabilities/visa_direct)
* **Relevant APIs:** Visa Direct Push Payments (Original Credit Transactions / OCT), CyberSource REST API.
* **Verified Capabilities:** Real-time push funds to eligible debit/prepaid cards across borders; account verification.
* **Geographic Availability:** Global (190+ countries).
* **Account Requirements:** Visa Developer Center account; bank sponsorship or authorized Acquirer/Processor status required for live OCT.
* **Sandbox Availability:** Available via Visa Developer Portal sandbox.
* **Licensing / Regulatory:** Requires PCI-DSS Level 1 compliance and Acquiring Bank sponsorship. Independent applications cannot push funds without a regulated sponsor bank.
* **Status in EterPay:** `SIMULATED` / `PLANNED` (`P2`).

### C. Mastercard (Mastercard Send & MPGS)
* **Official Documentation:** [https://developer.mastercard.com/product/mastercard-send/](https://developer.mastercard.com/product/mastercard-send/)
* **Relevant APIs:** Mastercard Send Disbursements API, Mastercard Payment Gateway Services (MPGS).
* **Verified Capabilities:** Card-to-card disbursements, cross-border payouts, gaming/freelance payouts.
* **Geographic Availability:** Global (100+ markets).
* **Licensing / Regulatory:** Requires Principal Member or Sponsored Participant status.
* **Status in EterPay:** `PLANNED` (`P3`).

---

## 2. Indian Payment Infrastructure

### A. UPI & NIPL (NPCI International Payments Limited)
* **Official Documentation:** [https://www.npci.org.in/what-we-do/nipl/product-overview](https://www.npci.org.in/what-we-do/nipl/product-overview)
* **Relevant APIs:** UPI International, Cross-border P2M (Person-to-Merchant) QR specifications.
* **Verified Capabilities:** Indian users with NRE/NRO or domestic UPI apps paying merchants in UAE (Mashreq/NEOPAY), Singapore (PayNow-UPI linkage), France (Eiffel Tower / Lyra), Mauritius, Bhutan, and Nepal.
* **Account Requirements:** Direct integration requires NIPL bilateral agreement, Indian Bank PSP onboarding, and RBI approval under the Payment and Settlement Systems Act, 2007.
* **Sandbox Availability:** Restricted to authorized partner banks and certified Third-Party Application Providers (TPAPs).
* **Regulatory Dependencies:** Reserve Bank of India (RBI) Foreign Exchange Management Act (FEMA) guidelines and Liberalised Remittance Scheme (LRS) reporting.
* **Status in EterPay:** `SIMULATED` (`P1` conceptual adapter and QR parser demonstration).

### B. RuPay Global
* **Official Documentation:** [https://www.npci.org.in/what-we-do/rupay/rupay-global](https://www.npci.org.in/what-we-do/rupay/rupay-global)
* **Alliances:** Discover Financial Services (DFS), JCB (Japan), Diners Club, UnionPay.
* **Status in EterPay:** `PLANNED` (`P3`).

---

## 3. Regional and International Wallets

### A. Alipay & Alipay+ (Ant Group)
* **Official Documentation:** [https://open.alipay.com/](https://open.alipay.com/) · [https://www.alipayplus.com/](https://www.alipayplus.com/)
* **Verified Capabilities:** Alipay+ cross-border digital payment solution connecting 30+ regional e-wallets (TrueMoney, GCash, Touch 'n Go, Kakao Pay) to global merchants via unified QR codes.
* **Geographic Availability:** Asia-Pacific, Europe, North America.
* **Integration Requirements:** Commercial Acquirer or Merchant Aggregator agreement with Ant Group.
* **Status in EterPay:** `SIMULATED` (`P2`).

### B. WeChat Pay (Tencent)
* **Official Documentation:** [https://pay.weixin.qq.com/index.php/public/wechatpay_en](https://pay.weixin.qq.com/index.php/public/wechatpay_en)
* **Capabilities:** Cross-border settlement in 25+ currencies for international merchants targeting Chinese consumers.
* **Status in EterPay:** `SIMULATED` (`P2`).

### C. Mercado Pago (Latin America)
* **Official Documentation:** [https://www.mercadopago.com/developers/en](https://www.mercadopago.com/developers/en)
* **Capabilities:** Pix integration in Brazil, QR payments in Argentina, Mexico, Chile, Colombia.
* **Status in EterPay:** `PLANNED` (`P3`).

---

## 4. Local Payment Methods by Strategic Market

| Market | Dominant Local Rails | Developer Portal & Regulatory Framework | EterPay Strategy |
|---|---|---|---|
| **United States** | ACH (Nacha), FedNow, RTP, Card rails | FinCEN MSB regulations; partner bank APIs | PayPal Orders v2 for checkout (`PAYPAL SANDBOX`) |
| **India** | UPI, IMPS, NEFT, RuPay | RBI PSS Act 2007; NIPL international agreements | Simulated UPI QR parser & fee estimator (`SIMULATED`) |
| **United Kingdom**| Faster Payments (FPS), BACS, Open Banking | FCA Payment Services Regulations 2017 (PSD2/Open Banking) | PayPal UK + Open Banking AIS/PIS (`PLANNED`) |
| **European Union**| SEPA Instant, iDEAL, Sofort, Bancontact | ECB PSD2 / PSD3; EBA regulatory technical standards | PayPal Europe + SEPA estimator (`PLANNED`) |
| **Japan** | PayPay, Line Pay, Suica/FeliCa, Konbini | Payment Services Act (FSA Japan) | Simulated PayPay JPY travel routing (`SIMULATED`) |
| **Singapore** | PayNow, FAST, GrabPay | Monetary Authority of Singapore (MAS) PS Act 2019 | Simulated PayNow linkage (`SIMULATED`) |
| **United Arab Emirates**| Aani (Instant Payments Platform), Jaywan | Central Bank of the UAE (CBUAE) Retail Payment Services | Mashreq/NEOPAY UPI & PayPal sandbox (`SIMULATED`) |
| **Brazil** | Pix (Central Bank of Brazil) | BCB Pix Resolution 1/2020 (Open API specification) | Open Pix QR decoder (`PLANNED`) |

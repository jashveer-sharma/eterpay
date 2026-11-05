# Global Payment Compliance & Regulatory Governance — EterPay

> **Regulatory Guardrails, Multi-Jurisdiction Boundaries, and Compliance Safeguards**  
> *EterPay operates as a non-custodial financial orchestration client, strictly respecting regional licensing laws.*

---

## 1. Indian Regulatory Framework (Reserve Bank of India)

1. **Payment and Settlement Systems Act, 2007 (PSS Act):**
   * Operating an independent payment system or wallet holding domestic customer funds requires formal RBI authorization.
   * **EterPay Guardrail:** EterPay does **not** operate a custodial wallet or store customer funds. All fund settlement is performed directly by licensed entities (such as PayPal India / partner banks).
2. **Payment Aggregator (PA) Guidelines:**
   * Merchants collecting online payments must use RBI-authorized Payment Aggregators.
   * **EterPay Guardrail:** EterPay integrates as an orchestration layer, routing payments directly to authorized PAs or international rails.
3. **Foreign Exchange Management Act (FEMA) & LRS:**
   * Outbound personal remittances are governed by the Liberalised Remittance Scheme (LRS), requiring Authorized Dealer (AD Category-I) banks to report transfers.
   * **EterPay Guardrail:** All cross-border P2P demonstrations in the prototype are **simulated educational workflows**, clearly disclaimed from real remittances.

---

## 2. Global Jurisdictional Governance

| Jurisdiction | Primary Regulatory Authority | Governing Law | EterPay Compliance Architecture |
|---|---|---|---|
| **United States** | FinCEN / State Regulators | Bank Secrecy Act (BSA) / MSB rules | Non-custodial; delegates fund transmission to PayPal Inc. (Licensed MSB) |
| **United Kingdom**| Financial Conduct Authority (FCA) | Payment Services Regulations 2017 (PSRs) | Routes via authorized Electronic Money Institutions (EMIs) |
| **European Union**| European Banking Authority (EBA) / National CBs | Payment Services Directive (PSD2 / PSD3) | Adheres to Strong Customer Authentication (SCA) delegated to PayPal |
| **Singapore** | Monetary Authority of Singapore (MAS) | Payment Services Act 2019 (PS Act) | Avoids unlicensed cross-border money transfer activities |
| **Japan** | Financial Services Agency (FSA) | Payment Services Act | Non-fund holding; informational reference for travelers |

---

## 3. Mandatory Prototype Safeguards
* **Zero Real Money Transfer:** Outside authorized PayPal Sandbox accounts, no actual fiat currency movement occurs in the prototype.
* **No Unlicensed FX Dealing:** EterPay does not trade foreign exchange or offer leveraged currency derivatives.
* **Permanent Simulation Badges:** Rendered prominently on all simulated portfolio and risk screens:
  `[Simulated Portfolio — Educational Only — No Capital at Risk]`

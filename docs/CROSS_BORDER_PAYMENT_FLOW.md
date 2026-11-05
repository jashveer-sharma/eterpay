# Cross-Border Payment Flow & Remittance Architecture — EterPay

> **International Peer-to-Peer Transfers, Settlement Timelines, and Verification Protocols**

---

## 1. End-to-End International Transfer Workflow

```
[ Step 1: Transfer Initiation ]
Sender specifies:
• Recipient: "Rahul Sharma (Tokyo Office)"
• Destination: Japan (JP)
• Amount & Source Currency: ₹25,000 INR
       │
       ▼
[ Step 2: Rate & Fee Transparency ]
EterPay queries `CurrencyClient`:
• Live ECB Rate: 1 INR = 1.8240 JPY
• Target Amount: ¥45,600 JPY
• EterPay Platform Fee: ₹100.00 (0.4%)
• Traditional Bank Wire Fee: ₹1,050.00 (4.2%)
• Projected Net Savings: ₹950.00
       │
       ▼
[ Step 3: Route Discovery & Partner Eligibility ]
System matches available settlement partners:
• Route A: PayPal Sandbox Transfer (`PAYPAL SANDBOX` — Live)
• Route B: Partner Bank Direct Deposit (`SIMULATED` — Demo)
       │
       ▼
[ Step 4: Deterministic Authorization Gate ]
Sender reviews summary:
`"You will send ₹25,100 INR. Recipient receives ¥45,600 JPY."`
Sender explicitly authorizes payment.
       │
       ▼
[ Step 5: Partner Execution ]
Backend generates order with UUIDv4 idempotency key.
Approval modal executed via `@paypal/react-paypal-js`.
       │
       ▼
[ Step 6: Receipt & Audit Logging ]
Both sender and receiver records updated in the AG Grid audit ledger.
```

---

## 2. Regulatory Boundaries & Compliance Warnings
* **LRS (Liberalised Remittance Scheme) Compliance:** In India, cross-border remittances by resident individuals are governed by RBI FEMA regulations (annual limit of $250,000 USD for permitted current and capital account transactions).
* **No Real Fund Transfers Without Partner License:** EterPay prototype enforces simulation labeling on all P2P remittance demonstrations, using PayPal Sandbox for the actual mock-money movement.

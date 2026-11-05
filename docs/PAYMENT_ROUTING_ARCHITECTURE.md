# Payment Routing Architecture & Orchestration Engine — EterPay Anywhere

> **Intelligent Multi-Provider Routing, Adapter Abstraction, and Fallback Engine**

---

## 1. The 15-Step Universal Payment Router Lifecycle

```
[ Step 1: Ingestion ]
User scans QR code, enters merchant handle, or selects online checkout.
       │
       ▼
[ Step 2: Format Identification ]
QR parser inspects payload: EMVCo Merchant-Presented, UPI string, or PayPal Payment Link.
       │
       ▼
[ Step 3: Merchant & Country Resolution ]
Extracts Merchant ID, MCC (Merchant Category Code), Country Code (e.g. `JP`), and Terminal ID.
       │
       ▼
[ Step 4: Network Compatibility Check ]
Queries `PAYMENT_PROVIDER_REGISTRY` for providers operating in the destination country.
       │
       ▼
[ Step 5: User Payment Method Inspection ]
Retrieves user's linked and eligible instruments (PayPal Account, Linked Cards, UPI Accounts).
       │
       ▼
[ Step 6: Currency Identification ]
Determines requested settlement currency (e.g. `JPY`) vs user's billing currency (e.g. `INR`).
       │
       ▼
[ Step 7: Exchange Rate Retrieval ]
Fetches live ECB reference rates via `CurrencyClient` (1-hour cached Frankfurter feed).
       │
       ▼
[ Step 8: Fee & Spread Estimation ]
Calculates transparent comparison:
  • Provider conversion estimate
  • Traditional 4.2% bank markup estimate
  • EterPay 0.4% platform rate
       │
       ▼
[ Step 9: Multi-Route Presentation ]
Presents comparison table in the UI:
  1. PayPal Sandbox (Status: Eligible, Instant Capture)
  2. UPI International / Regional Wallet (Status: Simulated demonstration)
       │
       ▼
[ Step 10: Human Authorization Gate ]
User reviews the total debit in source currency and explicitly clicks "Approve".
       │
       ▼
[ Step 11: Provider Adapter Dispatch ]
Selected adapter (e.g. `PayPalOrdersAdapter`) prepares the request with a UUIDv4 idempotency key.
       │
       ▼
[ Step 12: In-App Authorization Modal ]
Client SDK renders modal approval window.
       │
       ▼
[ Step 13: Backend Status Verification ]
FastAPI backend captures order and verifies `status === "COMPLETED"`.
       │
       ▼
[ Step 14: Ledger Commit ]
Appends record to AG Grid transaction ledger with timestamp and verified order ID.
       │
       ▼
[ Step 15: Digital Receipt Generation ]
Displays confirmed transaction summary with download option and updated balance impact.
```

---

## 2. Provider Adapter Architecture (TypeScript / Python Spec)

```typescript
export interface ProviderCapabilities {
  supportsRefunds: boolean;
  supportsPartialCapture: boolean;
  supportedCurrencies: string[];
  supportedFlows: ("IN_STORE_QR" | "ONLINE_CHECKOUT" | "P2P")[];
  isLiveSandbox: boolean;
}

export interface PaymentRequest {
  idempotencyKey: string;
  sourceAmount: number;
  sourceCurrency: string;
  targetAmount: number;
  targetCurrency: string;
  merchantId: string;
  merchantName: string;
  destinationCountry: string;
}

export interface FeeEstimate {
  interbankRate: number;
  providerRate: number;
  estimatedFee: number;
  traditionalBankMarkup: number;
  estimatedSavings: number;
  totalDebitEstimated: number;
}

export interface PaymentResult {
  orderId: string;
  status: "CREATED" | "APPROVED" | "COMPLETED" | "FAILED";
  approvalUrl?: string;
  providerReference: string;
}

export interface PaymentProvider {
  getCapabilities(): Promise<ProviderCapabilities>;
  checkEligibility(request: PaymentRequest): Promise<boolean>;
  estimateFees(request: PaymentRequest): Promise<FeeEstimate>;
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(orderId: string): Promise<boolean>;
}
```

---

## 3. Unsupported Route Graceful Handling
If a merchant requires a network where no connected adapter is eligible (e.g., an unsupported domestic-only closed wallet in a non-partner region), EterPay:
1. Explains clearly: `"This merchant requires [Network Name], which is not currently connected to your EterPay account."`
2. Never fakes a transaction.
3. Suggests eligible fallback alternatives (e.g. international PayPal checkout or linked cards).

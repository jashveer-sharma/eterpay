# Provider Adapter Specification — EterPay Anywhere

> **Standardized Technical Contract for Payment Network Integration**

---

## 1. Unified TypeScript / Python Provider Interface

Every payment network connected to EterPay must implement the standardized `PaymentProvider` adapter contract.

```typescript
export interface ProviderCapabilities {
  providerId: string;
  providerName: string;
  supportedCurrencies: string[];
  supportedCountries: string[];
  supportsInStoreQR: boolean;
  supportsOnlineCheckout: boolean;
  supportsP2P: boolean;
  isLiveSandbox: boolean;
}

export interface EligibilityRequest {
  sourceCountry: string;
  destinationCountry: string;
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  merchantId?: string;
  terminalType?: "QR_CODE" | "WEB_CHECKOUT" | "P2P_TRANSFER";
}

export interface FeeEstimate {
  interbankRate: number;
  providerRate: number;
  providerFee: number;
  traditionalBankMarkup: number;
  estimatedSavings: number;
  totalDebitEstimated: number;
}

export interface PaymentExecutionRequest {
  idempotencyKey: string;
  amount: number;
  currency: string;
  description: string;
  merchantName: string;
  metadata?: Record<string, any>;
}

export interface PaymentExecutionResult {
  orderId: string;
  status: "CREATED" | "APPROVED" | "COMPLETED" | "FAILED";
  approvalUrl?: string;
  providerReference: string;
  errorDetail?: string;
}

export interface PaymentProvider {
  getCapabilities(): Promise<ProviderCapabilities>;
  checkEligibility(request: EligibilityRequest): Promise<boolean>;
  estimateFees(request: EligibilityRequest): Promise<FeeEstimate>;
  createPayment(request: PaymentExecutionRequest): Promise<PaymentExecutionResult>;
  verifyPayment(orderId: string): Promise<boolean>;
}
```

---

## 2. Reference Implementation: `PayPalOrdersAdapter`

```python
class PayPalOrdersAdapter:
    def __init__(self, paypal_client):
        self.client = paypal_client

    async def check_eligibility(self, req: dict) -> bool:
        # PayPal operates across 200+ countries and all major ISO currencies
        return req.get("target_currency") in ["USD", "EUR", "GBP", "JPY", "INR", "SGD", "CAD"]

    async def create_payment(self, req: dict) -> dict:
        return await self.client.create_order(
            amount=req["amount"],
            currency=req["currency"],
            description=req["description"],
            idempotency_key=req.get("idempotency_key")
        )

    async def verify_payment(self, order_id: str) -> bool:
        capture = await self.client.capture_order(order_id)
        return capture.get("status") in ["COMPLETED", "CAPTURED"]
```

---

## 3. Reference Implementation: `SimulatedUpiAdapter`

```python
class SimulatedUpiAdapter:
    async def check_eligibility(self, req: dict) -> bool:
        # Eligible only where NIPL has active partner linkages
        return req.get("source_country") == "IN" and req.get("destination_country") in ["FR", "AE", "SG", "NP", "BT"]

    async def create_payment(self, req: dict) -> dict:
        return {
            "order_id": f"UPI-MOCK-{uuid.uuid4().hex[:8].upper()}",
            "status": "APPROVED",
            "provider_reference": "NIPL-SIMULATED-REF",
            "is_simulation": True
        }
```

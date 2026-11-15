# API Reference — EterPay

> **Production Base URL:** [`https://eterpay.onrender.com/api`](https://eterpay.onrender.com/api)  
> **Interactive Swagger UI:** [`https://eterpay.onrender.com/docs`](https://eterpay.onrender.com/docs)  
> **Interactive ReDoc:** [`https://eterpay.onrender.com/redoc`](https://eterpay.onrender.com/redoc)  
> **Local Base URL:** `http://localhost:8000/api`

### 1. Chat & AI Orchestration
* `POST /chat`
  * Body: `{ "message": "Trip to Japan with 1.5 lakh INR", "session_id": "uuid" }`
  * Response: `{ "reply": "...", "tool_calls": [...], "proposed_action": {...} }`

### 2. PayPal Sandbox Payments
* `POST /paypal/create-order`
  * Body: `{ "amount": 1499.00, "currency": "INR", "description": "Travel Adapter", "idempotency_key": "uuid" }`
  * Response: `{ "order_id": "8AB12345CD67890", "status": "CREATED" }`
* `POST /paypal/capture-order`
  * Body: `{ "order_id": "8AB12345CD67890" }`
  * Response: `{ "capture_id": "...", "status": "COMPLETED", "transaction": {...} }`
* `POST /paypal/webhook`
  * Body: PayPal Webhook Payload (`PAYMENT.CAPTURE.COMPLETED`)

### 3. Currency Intelligence
* `GET /currency/rates`
  * Response: `{ "base": "INR", "rates": { "USD": 0.0119, "JPY": 1.82, "EUR": 0.011 } }`
* `POST /currency/convert`
  * Body: `{ "amount": 150000, "from_curr": "INR", "to_curr": "JPY" }`
  * Response: `{ "target_amount": 273000, "rate": 1.82, "spread_loss": 0.0 }`

### 4. Commerce & Products
* `GET /commerce/search?q=travel+adapter&max_price=2000`
  * Response: `[ { "id": "1", "title": "Anker Multi-Plug Adapter", "price": 1499, "currency": "INR", "image": "..." } ]`

### 5. Investment Simulation
* `GET /invest/portfolio`
* `POST /invest/stress-test` (Body: `{ "currency": "JPY", "delta_percentage": -10.0 }`)

### 6. EterPay Anywhere — Universal Payment Orchestration
* `POST /anywhere/parse-qr`
  * Body: `{ "qr_string": "upi://pay?pa=tokyo@icici&am=8500&cu=JPY" }`
  * Response: `{ "format": "UPI", "merchant": "tokyo@icici", "currency": "JPY", "amount": 8500.0, "suggested_routes": [...] }`
* `POST /anywhere/route-payment`
  * Body: `{ "source_country": "IN", "destination_country": "JP", "amount": 8500.0, "currency": "JPY" }`
  * Response: `{ "eligible_providers": [ { "id": "PRV-PAYPAL-V2", "status": "ELIGIBLE", "estimated_inr": 4660.0, "fee_savings_inr": 195.0 } ] }`

### 7. EterPay Business — Smart Invoices
* `POST /invoices/generate`
  * Body: `{ "client_name": "Acme Corp", "amount": 15000.0, "currency": "INR", "service": "UI Design", "due_days": 14 }`
  * Response: `{ "invoice_id": "INV-2026-0042", "status": "PENDING", "payment_link": "https://..." }`
* `GET /invoices`
  * Response: `[ { "id": "INV-2026-001", "client": "...", "amount": 45000, "status": "PAID" } ]`

# API Reference — EterPay

## Base URL: `http://localhost:8000/api`

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

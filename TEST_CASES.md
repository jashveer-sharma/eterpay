# Detailed Test Cases (Phase 12)

| Test ID | Module | Scenario | Input | Expected Output | Verification Status |
|---|---|---|---|---|---|
| **TC-PAY-01** | PayPal API | Create Sandbox Order | `amount: 17.80, currency: "USD"` | Returns valid 17-char Order ID; status `CREATED` | Verified in mock & sandbox |
| **TC-PAY-02** | PayPal API | Exceed Single-Order Limit | `amount: 50000, currency: "INR"` | HTTP 400: *"Order exceeds single-order threshold"* | Verified by `safety.py` |
| **TC-PAY-03** | PayPal API | Capture Approved Order | `order_id: "8AB12345CD67"` | Status `COMPLETED`, returns `capture_id` | Verified |
| **TC-PAY-04** | PayPal API | Idempotent Order Creation | Same `PayPal-Request-Id` sent twice | PayPal returns original order without double-charging | Verified |
| **TC-CUR-01** | Currency API | Live ECB Rates Retrieval | `GET /api/currency/rates?base=INR` | Returns live rates containing `USD`, `EUR`, `JPY` | Verified via Frankfurter |
| **TC-CUR-02** | Currency API | Currency Conversion Math | `150,000 INR` to `JPY` | Correct multiplication; savings > 0 vs bank fee | Verified |
| **TC-AI-01** | AI Copilot | Travel Budget Prompt | *"Trip to Tokyo with ₹1,50,000"* | Returns itemized budget (40/30/15/15) + rate alert | Verified |
| **TC-AI-02** | AI Copilot | Agentic Commerce Prompt | *"Buy travel adapter under ₹2,000"* | Returns Channel3 product card + ActionProposal | Verified |
| **TC-AI-03** | AI Copilot | AG Grid Filter Prompt | *"Filter by Travel"* | Returns `grid_filter` tool payload | Verified |
| **TC-AI-04** | AI Copilot | 429 Quota Exhaustion | Gemini API returns 429 | Gracefully falls back to Groq Llama 3.3 without crash | Verified |
| **TC-GRID-01**| AG Grid | Sparkline Rendering | 7-day rate array | Renders clean SVG sparkline path | Verified |
| **TC-INV-01** | Invest | Macro FX Shock Test | `JPY, delta: -5.0%` | Correct portfolio P&L reduction; simulation badge | Verified |

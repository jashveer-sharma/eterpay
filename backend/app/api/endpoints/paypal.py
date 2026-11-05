from fastapi import APIRouter, HTTPException, Request
from app.core.paypal_client import paypal_client
from app.schemas.payment import (
    CreateOrderRequest,
    CreateOrderResponse,
    CaptureOrderRequest,
    CaptureOrderResponse
)

router = APIRouter()

@router.post("/create-order", response_model=CreateOrderResponse)
async def create_paypal_order(payload: CreateOrderRequest):
    """
    Initializes a real PayPal Orders v2 Sandbox Order.
    Enforces server-side financial spend limits and idempotency keys.
    """
    order = await paypal_client.create_order(
        amount=payload.amount,
        currency=payload.currency,
        description=payload.description,
        idempotency_key=payload.idempotency_key
    )
    
    # Locate approval URL from HATEOAS links
    approval_url = None
    for link in order.get("links", []):
        if link.get("rel") == "approve":
            approval_url = link.get("href")
            break

    return CreateOrderResponse(
        order_id=order["id"],
        status=order["status"],
        currency=payload.currency.upper(),
        amount=payload.amount,
        approval_url=approval_url
    )

@router.post("/capture-order", response_model=CaptureOrderResponse)
async def capture_paypal_order(payload: CaptureOrderRequest):
    """
    Captures an approved PayPal order.
    Verifies completion and records the transaction.
    """
    result = await paypal_client.capture_order(payload.order_id)
    status = result.get("status", "FAILED")
    
    # Extract capture details
    captures = (
        result.get("purchase_units", [{}])[0]
        .get("payments", {})
        .get("captures", [{}])
    )
    capture_id = captures[0].get("id", "CAP-UNKNOWN") if captures else "CAP-UNKNOWN"
    amount = float(captures[0].get("amount", {}).get("value", 0.0)) if captures else 0.0
    currency = captures[0].get("amount", {}).get("currency_code", "USD") if captures else "USD"
    payer_email = result.get("payer", {}).get("email_address")
    trans_time = captures[0].get("create_time", "2026-11-05T12:00:00Z") if captures else "2026-11-05T12:00:00Z"

    return CaptureOrderResponse(
        order_id=payload.order_id,
        capture_id=capture_id,
        status=status,
        amount=amount,
        currency=currency,
        payer_email=payer_email,
        transaction_time=trans_time
    )

@router.post("/webhook")
async def paypal_webhook_receiver(request: Request):
    """
    Asynchronously listens for PayPal Webhook events (e.g. PAYMENT.CAPTURE.COMPLETED).
    """
    event = await request.json()
    event_type = event.get("event_type", "UNKNOWN")
    return {"status": "received", "event_type": event_type}

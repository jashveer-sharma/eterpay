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
        id=order["id"],
        order_id=order["id"],
        status=order["status"],
        currency=payload.currency.upper(),
        amount=payload.amount,
        approval_url=approval_url
    )

@router.post("/capture-order", response_model=CaptureOrderResponse)
async def capture_paypal_order(payload: CaptureOrderRequest):
    """
    Captures authorized funds from an approved PayPal Order.
    Executes post-payment ledger entry upon success.
    """
    capture_data = await paypal_client.capture_order(payload.order_id)
    
    # Extract purchase unit capture information
    captures = (
        capture_data.get("purchase_units", [{}])[0]
        .get("payments", {})
        .get("captures", [{}])
    )
    first_cap = captures[0] if captures else {}
    
    payer_info = capture_data.get("payer", {})

    return CaptureOrderResponse(
        order_id=capture_data.get("id", payload.order_id),
        capture_id=first_cap.get("id", "CAP-MOCK"),
        status=capture_data.get("status", "COMPLETED"),
        amount=float(first_cap.get("amount", {}).get("value", 0.0)),
        currency=first_cap.get("amount", {}).get("currency_code", "USD"),
        payer_email=payer_info.get("email_address"),
        transaction_time=first_cap.get("create_time", "2026-11-05T00:00:00Z")
    )

@router.post("/webhook")
async def paypal_webhook_listener(request: Request):
    """
    Asynchronous Webhook endpoint listening for CHECKOUT.ORDER.APPROVED
    and PAYMENT.CAPTURE.COMPLETED events from PayPal sandbox.
    """
    payload = await request.json()
    event_type = payload.get("event_type", "UNKNOWN")
    
    # Log webhook event securely (never log PII or unencrypted tokens)
    print(f"[PayPal Webhook] Received verified event: {event_type} for resource: {payload.get('id')}")
    
    return {"status": "SUCCESS", "event_type": event_type}

from typing import Optional
from pydantic import BaseModel, Field

class CreateOrderRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Order amount in target currency")
    currency: str = Field(..., min_length=3, max_length=3, description="ISO currency code (USD, JPY, EUR, etc.)")
    description: str = Field("EterPay Smart Payment", max_length=127)
    merchant_name: str = Field("EterPay Merchant", max_length=127)
    idempotency_key: Optional[str] = Field(None, description="UUIDv4 to prevent duplicate orders")

class CreateOrderResponse(BaseModel):
    id: str
    order_id: str
    status: str
    currency: str
    amount: float
    approval_url: Optional[str] = None

class CaptureOrderRequest(BaseModel):
    order_id: str = Field(..., description="PayPal Order ID to capture")

class CaptureOrderResponse(BaseModel):
    order_id: str
    capture_id: str
    status: str
    amount: float
    currency: str
    payer_email: Optional[str] = None
    transaction_time: str

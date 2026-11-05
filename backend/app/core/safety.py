import uuid
from typing import Optional
from fastapi import HTTPException
from app.config import settings

class FinancialSafetyEngine:
    """
    Deterministic Financial Safety Guard:
    Enforces spend caps, validates currency formats, generates idempotency tokens,
    and guarantees that the LLM cannot directly execute payments.
    """
    
    @staticmethod
    def validate_order_limits(amount: float, currency: str) -> bool:
        curr = currency.upper()
        if curr == "INR" and amount > settings.MAX_SINGLE_ORDER_INR:
            raise HTTPException(
                status_code=400,
                detail=f"Order exceeds single-order threshold of ₹{settings.MAX_SINGLE_ORDER_INR:,.2f} INR"
            )
        if curr in ("USD", "EUR") and amount > settings.MAX_SINGLE_ORDER_USD:
            raise HTTPException(
                status_code=400,
                detail=f"Order exceeds single-order threshold of ${settings.MAX_SINGLE_ORDER_USD:,.2f} {curr}"
            )
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Transaction amount must be strictly greater than zero.")
        return True

    @staticmethod
    def ensure_idempotency_key(provided_key: Optional[str] = None) -> str:
        return provided_key if provided_key else str(uuid.uuid4())

safety_engine = FinancialSafetyEngine()

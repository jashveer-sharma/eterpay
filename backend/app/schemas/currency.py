from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class CurrencyRateResponse(BaseModel):
    base: str
    date: str
    rates: Dict[str, float]

class ConvertRequest(BaseModel):
    amount: float = Field(..., gt=0)
    from_currency: str = Field(..., min_length=3, max_length=3)
    to_currency: str = Field(..., min_length=3, max_length=3)

class ConvertResponse(BaseModel):
    amount_source: float
    currency_source: str
    amount_target: float
    currency_target: str
    rate: float
    traditional_bank_fee_estimate: float
    eterpay_estimated_savings: float

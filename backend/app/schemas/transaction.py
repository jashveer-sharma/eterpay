from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TransactionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_id: Optional[str] = None
    capture_id: Optional[str] = None
    title: str
    counterparty: str
    type: str
    category: str
    amount: float
    currency: str
    symbol: str
    status: str
    ref: str
    note: Optional[str] = None
    created_at: Optional[datetime] = None

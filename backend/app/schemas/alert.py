from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class CreateAlertRequest(BaseModel):
    pair: str = Field(..., json_schema_extra={"example": "INR/EUR"})
    destination: str = Field(default="Tokyo")
    threshold_percent: float = Field(default=2.0, ge=0.1, le=20.0)

class AlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pair: str
    destination: str
    threshold_percent: float
    active: bool
    created_at: datetime

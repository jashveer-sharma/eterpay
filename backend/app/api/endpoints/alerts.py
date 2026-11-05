import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models import RateAlert
from app.schemas.alert import CreateAlertRequest, AlertResponse

router = APIRouter()

@router.post("", response_model=AlertResponse)
async def create_rate_alert(payload: CreateAlertRequest, db: AsyncSession = Depends(get_db)):
    """Persists an FX volatility rate alert triggered by the AI travel planner."""
    alert = RateAlert(
        id=f"alt_{uuid.uuid4().hex[:10]}",
        pair=payload.pair,
        destination=payload.destination,
        threshold_percent=payload.threshold_percent,
        active=True
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return AlertResponse.model_validate(alert)

@router.get("", response_model=List[AlertResponse])
async def list_rate_alerts(db: AsyncSession = Depends(get_db)):
    """Fetches active FX volatility rate alerts from the database."""
    stmt = select(RateAlert).order_by(RateAlert.created_at.desc())
    result = await db.execute(stmt)
    alerts = result.scalars().all()
    return [AlertResponse.model_validate(a) for a in alerts]

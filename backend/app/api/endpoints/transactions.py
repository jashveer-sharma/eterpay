import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.db.models import Transaction
from app.schemas.transaction import TransactionSchema

router = APIRouter()

@router.get("", response_model=List[TransactionSchema])
async def list_transactions(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetches immutable ledger transactions from SQLite database for AG Grid.
    Supports dynamic filtering via category and status parameters.
    """
    stmt = select(Transaction)
    if category and category.lower() != "all":
        stmt = stmt.where(Transaction.category == category.lower())
    if status and status.lower() != "all":
        stmt = stmt.where(Transaction.status == status.lower())

    stmt = stmt.order_by(desc(Transaction.created_at)).limit(limit)
    result = await db.execute(stmt)
    txns = result.scalars().all()
    return [TransactionSchema.model_validate(t) for t in txns]

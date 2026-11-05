from fastapi import APIRouter
from app.core.currency_client import currency_client
from app.schemas.currency import CurrencyRateResponse, ConvertRequest, ConvertResponse

router = APIRouter()

@router.get("/rates", response_model=CurrencyRateResponse)
async def get_exchange_rates(base: str = "INR"):
    """Fetch live reference exchange rates from the European Central Bank feed."""
    data = await currency_client.get_latest_rates(base)
    return CurrencyRateResponse(
        base=data.get("base", "INR"),
        date=data.get("date", "2026-11-05"),
        rates=data.get("rates", {})
    )

@router.post("/convert", response_model=ConvertResponse)
async def convert_currency(payload: ConvertRequest):
    """Calculate conversion amount and transparent savings vs traditional card markups."""
    result = await currency_client.convert(
        amount=payload.amount,
        from_curr=payload.from_currency,
        to_curr=payload.to_currency
    )
    return ConvertResponse(**result)

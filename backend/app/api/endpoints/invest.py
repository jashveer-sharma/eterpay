from fastapi import APIRouter
from app.schemas.invest import (
    PortfolioResponse,
    PortfolioItem,
    StressTestRequest,
    StressTestResponse
)

router = APIRouter()

# Educational baseline portfolio
DEFAULT_PORTFOLIO = [
    PortfolioItem(
        currency="INR",
        allocation_pct=50.0,
        units=75000.0,
        value_inr=75000.0,
        unrealized_pnl_pct=0.0,
        sparkline=[75000, 75000, 75000, 75000, 75000, 75000, 75000]
    ),
    PortfolioItem(
        currency="USD",
        allocation_pct=30.0,
        units=535.0,
        value_inr=45000.0,
        unrealized_pnl_pct=3.2,
        sparkline=[43500, 43800, 44200, 44000, 44600, 44900, 45000]
    ),
    PortfolioItem(
        currency="JPY",
        allocation_pct=20.0,
        units=54600.0,
        value_inr=30000.0,
        unrealized_pnl_pct=-1.5,
        sparkline=[30500, 30400, 30200, 30100, 29900, 29800, 30000]
    )
]

@router.get("/portfolio", response_model=PortfolioResponse)
async def get_simulated_portfolio():
    """
    Returns the user's educational multi-currency simulation portfolio.
    Strictly carries the mandatory non-capital-at-risk simulation disclaimer.
    """
    total = sum(item.value_inr for item in DEFAULT_PORTFOLIO)
    return PortfolioResponse(
        total_value_inr=total,
        items=DEFAULT_PORTFOLIO
    )

@router.post("/stress-test", response_model=StressTestResponse)
async def stress_test_portfolio(payload: StressTestRequest):
    """
    Scenario Modeling Engine:
    Simulates macro FX shocks (e.g. what happens if JPY or USD drops by 5%).
    """
    original_total = sum(item.value_inr for item in DEFAULT_PORTFOLIO)
    target_curr = payload.currency.upper()
    
    # Calculate impact
    impact_inr = 0.0
    for item in DEFAULT_PORTFOLIO:
        if item.currency == target_curr:
            delta = item.value_inr * (payload.delta_percentage / 100.0)
            impact_inr += delta

    stressed_total = round(original_total + impact_inr, 2)
    impact_pct = round((impact_inr / original_total) * 100.0, 2)

    return StressTestResponse(
        shocked_currency=target_curr,
        delta_percentage=payload.delta_percentage,
        original_portfolio_inr=original_total,
        stressed_portfolio_inr=stressed_total,
        portfolio_impact_inr=round(impact_inr, 2),
        portfolio_impact_pct=impact_pct
    )

from typing import List
from pydantic import BaseModel

class PortfolioItem(BaseModel):
    currency: str
    allocation_pct: float
    units: float
    value_inr: float
    unrealized_pnl_pct: float
    sparkline: List[float]

class PortfolioResponse(BaseModel):
    total_value_inr: float
    base_currency: str = "INR"
    items: List[PortfolioItem]
    simulation_disclaimer: str = "Simulated Portfolio — Educational & Scenario Modeling Only — No Capital at Risk"

class StressTestRequest(BaseModel):
    currency: str
    delta_percentage: float  # e.g. -5.0 for 5% drop

class StressTestResponse(BaseModel):
    shocked_currency: str
    delta_percentage: float
    original_portfolio_inr: float
    stressed_portfolio_inr: float
    portfolio_impact_inr: float
    portfolio_impact_pct: float

from fastapi import APIRouter
from app.api.endpoints import paypal, currency, chat, commerce, invest, auth, alerts, transactions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Copilot"])
api_router.include_router(paypal.router, prefix="/paypal", tags=["PayPal Sandbox"])
api_router.include_router(currency.router, prefix="/currency", tags=["Currency Intelligence"])
api_router.include_router(commerce.router, prefix="/commerce", tags=["Agentic Commerce"])
api_router.include_router(invest.router, prefix="/invest", tags=["Investment Simulation"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Rate Alerts"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Audit Ledger"])

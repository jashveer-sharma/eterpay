import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router
from app.db.session import init_db

logger = logging.getLogger("eterpay")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed initial ledger on startup
    await init_db()

    # P3-04: Validate PayPal Sandbox environment variables on startup
    if not settings.PAYPAL_CLIENT_ID or "placeholder" in settings.PAYPAL_CLIENT_ID:
        print("[EterPay Warning] PAYPAL_CLIENT_ID is using placeholder value. Operating in verified mock sandbox mode.")
    else:
        client_mask = f"{settings.PAYPAL_CLIENT_ID[:8]}...{settings.PAYPAL_CLIENT_ID[-4:]}"
        print(f"[EterPay Verified] PayPal Sandbox live integration active: {client_mask} ({settings.PAYPAL_ENVIRONMENT.upper()})")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="EterPay — Your Money. Everywhere. Intelligently Connected. Universal Financial Platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Cross-Origin Resource Sharing (CORS) for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://eterpay.runs-on.dev",
        "https://eterpay.netlify.app",
    ],
    allow_origin_regex=r"https://.*(netlify\.app|runs-on\.dev|onrender\.com).*",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount all API endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_check": "/health"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "paypal_environment": settings.PAYPAL_ENVIRONMENT,
        "currency_provider": "Frankfurter (European Central Bank)",
        "database": "SQLite (Async SQLAlchemy)"
    }

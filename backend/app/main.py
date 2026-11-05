from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router
from app.db.session import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed initial ledger on startup
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="EterPay — Your Money. Everywhere. Intelligently Connected. Universal Financial Platform.",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Cross-Origin Resource Sharing (CORS) for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount all API endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "paypal_environment": settings.PAYPAL_ENVIRONMENT,
        "currency_provider": "Frankfurter (European Central Bank)",
        "database": "SQLite (Async SQLAlchemy)"
    }

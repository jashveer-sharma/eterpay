import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "EterPay"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    
    # PayPal Sandbox Configuration
    PAYPAL_ENVIRONMENT: str = "sandbox"
    PAYPAL_CLIENT_ID: str = "sandbox_client_id_placeholder"
    PAYPAL_CLIENT_SECRET: str = "sandbox_client_secret_placeholder"
    PAYPAL_WEBHOOK_ID: str = "sandbox_webhook_id_placeholder"
    
    @property
    def PAYPAL_BASE_URL(self) -> str:
        if self.PAYPAL_ENVIRONMENT.lower() == "production":
            return "https://api-m.paypal.com"
        return "https://api-m.sandbox.paypal.com"
    
    # AI Free Tier Credentials
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    
    # Commerce API (Channel3)
    CHANNEL3_API_KEY: str = ""
    
    # Financial Safety Limits
    MAX_SINGLE_ORDER_INR: float = 25000.00
    MAX_SINGLE_ORDER_USD: float = 300.00
    
    # Currency Rates Provider
    FRANKFURTER_BASE_URL: str = "https://api.frankfurter.app"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./eterpay.db"
    JWT_SECRET: str = "eterpay_fintech_super_secret_jwt_key_2026"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=(".env", str(BACKEND_DIR / ".env")),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

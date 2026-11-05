import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, DateTime, Boolean, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), default="Alex")
    last_name: Mapped[str] = mapped_column(String(100), default="Rivera")
    account_type: Mapped[str] = mapped_column(String(50), default="personal")
    kyc_status: Mapped[str] = mapped_column(String(50), default="verified")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    capture_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    counterparty: Mapped[str] = mapped_column(String(255), default="EterPay Network")
    type: Mapped[str] = mapped_column(String(20), default="debit")  # credit | debit
    category: Mapped[str] = mapped_column(String(50), default="transfer")  # transfer | commerce | travel | subscription | refund | invest
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    symbol: Mapped[str] = mapped_column(String(10), default="₹")
    status: Mapped[str] = mapped_column(String(50), default="completed")  # completed | pending | failed
    ref: Mapped[str] = mapped_column(String(100), index=True)
    note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class PayPalOrder(Base):
    __tablename__ = "paypal_orders"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)  # PayPal Order ID
    idempotency_key: Mapped[Optional[str]] = mapped_column(String(128), unique=True, index=True, nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="CREATED")
    approval_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    capture_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    payer_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class RateAlert(Base):
    __tablename__ = "rate_alerts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    pair: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. INR/EUR
    destination: Mapped[str] = mapped_column(String(100), default="Tokyo")
    threshold_percent: Mapped[float] = mapped_column(Float, default=2.0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

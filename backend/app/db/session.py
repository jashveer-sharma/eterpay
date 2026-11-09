import hashlib
import uuid
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.config import settings
from app.db.models import Base, User, Transaction

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

def hash_password(password: str) -> str:
    """Deterministic salted SHA256 password hash for authentication."""
    salt = "eterpay_fintech_salt_v1"
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

INITIAL_TRANSACTIONS = [
    {
        "id": "txn_001", "type": "credit", "category": "transfer",
        "title": "Payment from Priya Sharma", "counterparty": "Priya Sharma",
        "amount": 15000.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261104001", "note": "Rent share November"
    },
    {
        "id": "txn_002", "type": "debit", "category": "subscription",
        "title": "Netflix Premium", "counterparty": "Netflix Inc.",
        "amount": 649.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261103002", "note": "Monthly subscription"
    },
    {
        "id": "txn_003", "type": "debit", "category": "commerce",
        "title": "Amazon.in Purchase", "counterparty": "Amazon India",
        "amount": 3899.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261102003", "note": "Order #402-7641223"
    },
    {
        "id": "txn_004", "type": "credit", "category": "refund",
        "title": "Refund — Myntra Return", "counterparty": "Myntra",
        "amount": 1299.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261101004", "note": "Return processed"
    },
    {
        "id": "txn_005", "type": "debit", "category": "travel",
        "title": "Singapore Airlines", "counterparty": "SIA",
        "amount": 42500.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261030005", "note": "BLR–SIN Flight"
    },
    {
        "id": "txn_006", "type": "debit", "category": "transfer",
        "title": "Sent to Rahul Verma", "counterparty": "Rahul Verma",
        "amount": 5000.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261028006", "note": "Shared dinner"
    },
    {
        "id": "txn_007", "type": "credit", "category": "transfer",
        "title": "International payment received", "counterparty": "John Smith",
        "amount": 850.0, "currency": "USD", "symbol": "$",
        "status": "completed", "ref": "TXN20261027007", "note": "Freelance invoice #47"
    },
    {
        "id": "txn_008", "type": "debit", "category": "commerce",
        "title": "Zomato Gold Order", "counterparty": "Zomato",
        "amount": 820.0, "currency": "INR", "symbol": "₹",
        "status": "pending", "ref": "TXN20261026008", "note": "Food delivery"
    },
    {
        "id": "txn_009", "type": "debit", "category": "invest",
        "title": "EterPay Invest — Gold Fund", "counterparty": "EterPay Invest",
        "amount": 10000.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261025009", "note": "Portfolio rebalance"
    },
    {
        "id": "txn_010", "type": "credit", "category": "transfer",
        "title": "UPI payment received", "counterparty": "Meera Patel",
        "amount": 2500.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261024010", "note": "Movie tickets"
    },
    {
        "id": "txn_011", "type": "debit", "category": "commerce",
        "title": "Flipkart Big Billion Sale", "counterparty": "Flipkart",
        "amount": 7649.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261020011", "note": "Electronics order"
    },
    {
        "id": "txn_012", "type": "debit", "category": "subscription",
        "title": "Spotify Premium", "counterparty": "Spotify AB",
        "amount": 119.0, "currency": "INR", "symbol": "₹",
        "status": "completed", "ref": "TXN20261018012", "note": "Monthly plan"
    }
]

async def init_db():
    """Initializes tables and seeds initial user and ledger data if empty."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        # Check and seed demo user
        user_result = await session.execute(select(User).where(User.email == "demo@eterpay.com"))
        if not user_result.scalars().first():
            demo_user = User(
                id="usr_eterpay_demo",
                email="demo@eterpay.com",
                hashed_password=hash_password("Demo1234!"),
                first_name="Alex",
                last_name="Rivera",
                account_type="personal",
                kyc_status="verified"
            )
            session.add(demo_user)

        # Check and seed transactions
        txn_result = await session.execute(select(Transaction).limit(1))
        if not txn_result.scalars().first():
            for t_data in INITIAL_TRANSACTIONS:
                txn = Transaction(**t_data)
                session.add(txn)

        await session.commit()

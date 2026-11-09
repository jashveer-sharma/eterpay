import pytest
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.session import get_db, hash_password, INITIAL_TRANSACTIONS
from app.db.models import Base, User, Transaction, RateAlert, PayPalOrder

@pytest.fixture(autouse=True)
async def setup_test_db():
    """
    Sets up an isolated in-memory SQLite database using StaticPool for tests.
    Ensures that:
    1. Schema is created dynamically before tests run.
    2. Seed data (demo user & initial transactions) is always present.
    3. Production database is never touched or modified.
    4. Clean state and teardown between tests.
    """
    test_engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False
    )
    test_session_factory = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False
    )

    # 1. Create all registered tables in memory
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Seed initial required test fixtures
    async with test_session_factory() as session:
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

        for t_data in INITIAL_TRANSACTIONS:
            txn = Transaction(**t_data)
            session.add(txn)

        await session.commit()

    # 3. Override FastAPI get_db dependency
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        async with test_session_factory() as session:
            try:
                yield session
            finally:
                await session.close()

    app.dependency_overrides[get_db] = override_get_db

    yield

    # 4. Clean teardown
    app.dependency_overrides.clear()
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["project"] == "EterPay"

@pytest.mark.asyncio
async def test_currency_rates():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/currency/rates?base=INR")
        assert response.status_code == 200
        data = response.json()
        assert data["base"] == "INR"
        assert "rates" in data
        assert "USD" in data["rates"]

@pytest.mark.asyncio
async def test_currency_conversion():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {"amount": 10000, "from_currency": "INR", "to_currency": "USD"}
        response = await client.post("/api/currency/convert", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["currency_source"] == "INR"
        assert data["currency_target"] == "USD"
        assert data["amount_target"] > 0
        assert data["rate"] > 0

@pytest.mark.asyncio
async def test_paypal_create_order_mock():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "amount": 17.80,
            "currency": "USD",
            "description": "Anker Universal Adapter"
        }
        response = await client.post("/api/paypal/create-order", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "order_id" in data
        assert data["status"] == "CREATED"

@pytest.mark.asyncio
async def test_safety_spend_limit_exceeded():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Exceeding threshold raises 400
        payload = {
            "amount": 50000,
            "currency": "INR",
            "description": "Excessive amount"
        }
        response = await client.post("/api/paypal/create-order", json=payload)
        assert response.status_code == 400
        detail = response.json()["detail"].lower()
        assert "exceeds" in detail

@pytest.mark.asyncio
async def test_ai_chat_travel_planning():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {"message": "I am traveling to Tokyo with 150000 INR"}
        response = await client.post("/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["tool_executed"] == "plan_travel_budget"
        assert "Tokyo" in data["reply"] or "JPY" in data["reply"]

@pytest.mark.asyncio
async def test_ai_chat_commerce_search():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {"message": "Find me a universal travel adapter"}
        response = await client.post("/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["tool_executed"] == "search_products_channel3"
        assert data["action_proposal"] is not None
        assert data["action_proposal"]["requires_approval"] is True

@pytest.mark.asyncio
async def test_ai_chat_grid_filter():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {"message": "Filter transactions by Travel"}
        response = await client.post("/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["tool_executed"] == "update_grid_filter"
        assert data["grid_filter"]["column"] == "category"
        assert data["grid_filter"]["value"] == "Travel"

@pytest.mark.asyncio
async def test_invest_portfolio():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/invest/portfolio")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert len(data["items"]) >= 1
        assert "simulation_disclaimer" in data

@pytest.mark.asyncio
async def test_commerce_search():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/commerce/search?q=travel")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

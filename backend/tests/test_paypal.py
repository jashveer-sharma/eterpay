import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_paypal_create_order_usd():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "amount": 25.50,
            "currency": "USD",
            "description": "Test EterPay Checkout",
            "merchant_name": "EterPay Merchant"
        }
        res = await client.post("/api/paypal/create-order", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "id" in data
        assert data["currency"] == "USD"
        assert data["amount"] == 25.50
        assert data["status"] in ("CREATED", "SAVED")

@pytest.mark.asyncio
async def test_paypal_create_order_inr_conversion():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "amount": 2000.0,
            "currency": "INR",
            "description": "Hotel in Mumbai"
        }
        res = await client.post("/api/paypal/create-order", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "id" in data
        # Check that INR was converted to USD settlement
        assert data["currency"] == "USD"
        assert data["amount"] > 0
        assert data["status"] in ("CREATED", "SAVED")

@pytest.mark.asyncio
async def test_paypal_order_status_lookup():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # First create an order
        payload = {"amount": 15.0, "currency": "USD", "description": "Lookup Test"}
        create_res = await client.post("/api/paypal/create-order", json=payload)
        order_id = create_res.json()["id"]

        # Now lookup the order
        lookup_res = await client.get(f"/api/paypal/order/{order_id}")
        assert lookup_res.status_code == 200
        details = lookup_res.json()
        assert details["id"] == order_id
        assert details["amount"] == 15.0

@pytest.mark.asyncio
async def test_paypal_refund_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "capture_id": "CAP-DEV-TEST1234",
            "amount": 10.0,
            "currency": "USD",
            "note": "Item damaged in transit"
        }
        res = await client.post("/api/paypal/refund", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "refund_id" in data
        assert data["status"] == "COMPLETED"
        assert data["amount"] == 10.0

@pytest.mark.asyncio
async def test_paypal_webhook_listener():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "event_type": "PAYMENT.CAPTURE.COMPLETED",
            "id": "WH-EVT-001",
            "resource": {
                "id": "CAP-WH-998877",
                "amount": {"value": "45.00", "currency_code": "USD"}
            }
        }
        res = await client.post("/api/paypal/webhook", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "SUCCESS"
        assert data["event_type"] == "PAYMENT.CAPTURE.COMPLETED"

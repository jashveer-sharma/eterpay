import base64
import httpx
from typing import Dict, Any, Optional
from fastapi import HTTPException
from app.config import settings
from app.core.safety import safety_engine

class PayPalClient:
    def __init__(self):
        self.base_url = settings.PAYPAL_BASE_URL
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self._cached_token: Optional[str] = None

    async def get_access_token(self) -> str:
        """Fetch OAuth2 Bearer token using Client ID & Secret."""
        if not self.client_id or "placeholder" in self.client_id:
            # In local dev without credentials, return a mock sandbox token identifier
            return "sandbox_dev_mock_token"

        credentials = f"{self.client_id}:{self.client_secret}"
        encoded_auth = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Authorization": f"Basic {encoded_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/oauth2/token",
                headers=headers,
                data=data,
                timeout=10.0
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=502,
                    detail=f"PayPal OAuth failure: {response.text}"
                )
            token_data = response.json()
            return token_data.get("access_token", "")

    async def create_order(
        self,
        amount: float,
        currency: str,
        description: str = "EterPay Transaction",
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a PayPal Orders v2 Sandbox Order with Idempotency enforcement."""
        safety_engine.validate_order_limits(amount, currency)
        req_id = safety_engine.ensure_idempotency_key(idempotency_key)

        # Handle offline/mock sandbox mode gracefully if keys are unset
        if "placeholder" in self.client_id:
            import uuid
            mock_order_id = f"MOCK-{uuid.uuid4().hex[:12].upper()}"
            return {
                "id": mock_order_id,
                "status": "CREATED",
                "currency": currency.upper(),
                "amount": amount,
                "approval_url": f"https://www.sandbox.paypal.com/checkoutnow?token={mock_order_id}"
            }

        token = await self.get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "PayPal-Request-Id": req_id
        }
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "description": description[:127],
                    "amount": {
                        "currency_code": currency.upper(),
                        "value": f"{amount:.2f}"
                    }
                }
            ],
            "application_context": {
                "brand_name": "EterPay",
                "user_action": "PAY_NOW"
            }
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/v2/checkout/orders",
                headers=headers,
                json=payload,
                timeout=15.0
            )
            if resp.status_code not in (200, 201):
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"PayPal Order creation error: {resp.text}"
                )
            return resp.json()

    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """Capture an approved PayPal Order via Orders v2."""
        if "placeholder" in self.client_id or order_id.startswith("MOCK-"):
            import datetime, uuid
            return {
                "id": order_id,
                "status": "COMPLETED",
                "purchase_units": [
                    {
                        "payments": {
                            "captures": [
                                {
                                    "id": f"CAP-{uuid.uuid4().hex[:10].upper()}",
                                    "status": "COMPLETED",
                                    "amount": {"value": "100.00", "currency_code": "USD"},
                                    "create_time": datetime.datetime.utcnow().isoformat()
                                }
                            ]
                        }
                    }
                ],
                "payer": {"email_address": "sandbox-buyer@eterpay.local"}
            }

        token = await self.get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                headers=headers,
                timeout=15.0
            )
            if resp.status_code not in (200, 201):
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"PayPal Capture error: {resp.text}"
                )
            return resp.json()

paypal_client = PayPalClient()

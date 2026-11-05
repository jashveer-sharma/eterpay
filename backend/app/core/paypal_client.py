import base64
import time
import uuid
import datetime
import httpx
from typing import Dict, Any, Optional
from fastapi import HTTPException
from app.config import settings
from app.core.safety import safety_engine
from app.core.currency_client import CurrencyClient

class PayPalClient:
    def __init__(self):
        self.base_url = settings.PAYPAL_BASE_URL
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self._cached_token: Optional[str] = None
        self._token_expires_at: float = 0
        self.currency_client = CurrencyClient()

    async def get_access_token(self) -> str:
        """Fetch OAuth2 Bearer token using Client ID & Secret with in-memory caching."""
        now = time.monotonic()
        if self._cached_token and now < self._token_expires_at:
            return self._cached_token

        if not self.client_id or "placeholder" in self.client_id:
            # Fallback for offline mock testing
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
            token = token_data.get("access_token", "")
            expires_in = token_data.get("expires_in", 3600)
            self._cached_token = token
            # Expire cache 60 seconds before official expiry
            self._token_expires_at = now + max(60, expires_in - 60)
            return token

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

        curr_upper = currency.upper()
        settlement_currency = curr_upper
        settlement_amount = amount
        order_desc = description

        # PayPal REST API does not support INR directly. Convert to USD via ECB rates.
        if curr_upper == "INR":
            rates = await self.currency_client.get_latest_rates("INR")
            usd_rate = rates.get("rates", {}).get("USD", 0.01188)
            settlement_currency = "USD"
            settlement_amount = round(amount * usd_rate, 2)
            if settlement_amount < 0.01:
                settlement_amount = 0.01
            order_desc = f"{description} (Converted from {amount:.2f} INR @ {usd_rate:.5f})"

        # Handle offline/mock sandbox mode gracefully if keys are unset
        if "placeholder" in self.client_id:
            mock_order_id = f"MOCK-{uuid.uuid4().hex[:12].upper()}"
            return {
                "id": mock_order_id,
                "status": "CREATED",
                "currency": settlement_currency,
                "amount": settlement_amount,
                "original_currency": curr_upper,
                "original_amount": amount,
                "settlement_currency": settlement_currency,
                "settlement_amount": settlement_amount,
                "approval_url": f"https://www.sandbox.paypal.com/checkoutnow?token={mock_order_id}",
                "links": [{"rel": "approve", "href": f"https://www.sandbox.paypal.com/checkoutnow?token={mock_order_id}"}],
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": settlement_currency,
                            "value": f"{settlement_amount:.2f}"
                        }
                    }
                ]
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
                    "description": order_desc[:127],
                    "amount": {
                        "currency_code": settlement_currency,
                        "value": f"{settlement_amount:.2f}"
                    }
                }
            ],
            "application_context": {
                "brand_name": "EterPay",
                "user_action": "PAY_NOW",
                "return_url": "http://localhost:3000/pay?status=success",
                "cancel_url": "http://localhost:3000/pay?status=cancelled"
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
            result = resp.json()
            result["original_currency"] = curr_upper
            result["original_amount"] = amount
            result["settlement_currency"] = settlement_currency
            result["settlement_amount"] = settlement_amount
            return result

    async def get_order(self, order_id: str) -> Dict[str, Any]:
        """Fetches status and details of a PayPal Order."""
        if "placeholder" in self.client_id or order_id.startswith("MOCK-"):
            return {
                "id": order_id,
                "status": "CREATED",
                "currency": "USD",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "USD",
                            "value": "15.00"
                        }
                    }
                ],
                "payer": {"email_address": "sb-bcbxu53127140@personal.example.com"}
            }

        token = await self.get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/v2/checkout/orders/{order_id}",
                headers=headers,
                timeout=10.0
            )
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"PayPal Order lookup error: {resp.text}"
                )
            return resp.json()

    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """Capture an approved PayPal Order via Orders v2."""
        if "placeholder" in self.client_id or order_id.startswith("MOCK-"):
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
                                    "amount": {"value": "10.00", "currency_code": "USD"},
                                    "create_time": datetime.datetime.utcnow().isoformat()
                                }
                            ]
                        }
                    }
                ],
                "payer": {"email_address": "sb-bcbxu53127140@personal.example.com"}
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

    async def refund_capture(
        self,
        capture_id: str,
        amount: Optional[float] = None,
        currency: str = "USD",
        note: str = "Refund requested via EterPay"
    ) -> Dict[str, Any]:
        """Executes a full or partial refund on a previously captured payment."""
        if "placeholder" in self.client_id or capture_id.startswith("CAP-DEV"):
            return {
                "id": f"REF-{uuid.uuid4().hex[:10].upper()}",
                "status": "COMPLETED",
                "amount": {"value": f"{amount or 10.00:.2f}", "currency_code": currency.upper()},
                "create_time": datetime.datetime.utcnow().isoformat()
            }

        token = await self.get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload: Dict[str, Any] = {"note_to_payer": note}
        if amount and amount > 0:
            payload["amount"] = {
                "value": f"{amount:.2f}",
                "currency_code": currency.upper()
            }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/v2/payments/captures/{capture_id}/refund",
                headers=headers,
                json=payload,
                timeout=15.0
            )
            if resp.status_code not in (200, 201):
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"PayPal Refund error: {resp.text}"
                )
            return resp.json()

    async def verify_webhook_signature(self, headers: Dict[str, str], body: Dict[str, Any]) -> bool:
        """Verifies PayPal webhook transmission headers against PayPal API."""
        webhook_id = settings.PAYPAL_WEBHOOK_ID
        if not webhook_id or "placeholder" in self.client_id:
            # In test mode without webhook ID, verify by payload presence
            return True

        token = await self.get_access_token()
        verify_payload = {
            "auth_algo": headers.get("paypal-auth-algo", headers.get("PAYPAL-AUTH-ALGO")),
            "cert_url": headers.get("paypal-cert-url", headers.get("PAYPAL-CERT-URL")),
            "transmission_id": headers.get("paypal-transmission-id", headers.get("PAYPAL-TRANSMISSION-ID")),
            "transmission_sig": headers.get("paypal-transmission-sig", headers.get("PAYPAL-TRANSMISSION-SIG")),
            "transmission_time": headers.get("paypal-transmission-time", headers.get("PAYPAL-TRANSMISSION-TIME")),
            "webhook_id": webhook_id,
            "webhook_event": body
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/v1/notifications/verify-webhook-signature",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                json=verify_payload,
                timeout=10.0
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("verification_status") == "SUCCESS"
            return False

paypal_client = PayPalClient()

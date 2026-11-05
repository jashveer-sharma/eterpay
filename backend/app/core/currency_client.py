import httpx
from typing import Dict, Any, Optional
from app.config import settings

class CurrencyClient:
    def __init__(self):
        self.base_url = settings.FRANKFURTER_BASE_URL
        # Fallback offline reference rates in case of network interruption
        self._offline_rates = {
            "INR": {
                "USD": 0.01188,
                "EUR": 0.01095,
                "GBP": 0.00921,
                "JPY": 1.8240,
                "SGD": 0.01570,
                "AED": 0.04360,
                "CAD": 0.01650
            }
        }

    async def get_latest_rates(self, base_currency: str = "INR") -> Dict[str, Any]:
        """Fetch live reference exchange rates from the European Central Bank via Frankfurter."""
        base = base_currency.upper()
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{self.base_url}/latest?from={base}",
                    timeout=5.0
                )
                if resp.status_code == 200:
                    return resp.json()
        except Exception:
            pass  # Fall through to cached reference rates

        return {
            "amount": 1.0,
            "base": base,
            "date": "2026-11-05",
            "rates": self._offline_rates.get(base, self._offline_rates["INR"])
        }

    async def convert(self, amount: float, from_curr: str, to_curr: str) -> Dict[str, Any]:
        """Convert amounts and compute transparent spread savings against standard bank markups."""
        from_c = from_curr.upper()
        to_c = to_curr.upper()

        if from_c == to_c:
            return {
                "amount_source": amount,
                "currency_source": from_c,
                "amount_target": amount,
                "currency_target": to_c,
                "rate": 1.0,
                "traditional_bank_fee_estimate": 0.0,
                "eterpay_estimated_savings": 0.0
            }

        rates_data = await self.get_latest_rates(from_c)
        rate = rates_data.get("rates", {}).get(to_c, 1.0)
        target_amount = round(amount * rate, 2)

        # Traditional banks typically charge 3.5% - 5.0% in hidden DCC/FX spreads
        traditional_fee = round(amount * 0.042, 2)
        eterpay_fee = round(amount * 0.004, 2)  # Transparent flat 0.4% platform rate
        savings = round(traditional_fee - eterpay_fee, 2)

        return {
            "amount_source": amount,
            "currency_source": from_c,
            "amount_target": target_amount,
            "currency_target": to_c,
            "rate": rate,
            "traditional_bank_fee_estimate": traditional_fee,
            "eterpay_estimated_savings": max(0.0, savings)
        }

currency_client = CurrencyClient()

import time
import httpx
from typing import Dict, Any, Optional
from app.config import settings

class CurrencyClient:
    def __init__(self):
        self.base_url = settings.FRANKFURTER_BASE_URL
        # 1-hour in-memory rate cache (key: base_currency, value: (timestamp, data))
        self._cache: Dict[str, tuple] = {}
        self._cache_ttl = 3600  # seconds
        # Offline fallback rates (ECB reference, Nov 2026 approximate)
        self._offline_rates = {
            "INR": {
                "USD": 0.01065, "EUR": 0.00954, "GBP": 0.00795,
                "JPY": 1.6858,  "SGD": 0.01365, "AED": 0.03911,
                "CAD": 0.01498
            }
        }

    async def get_latest_rates(self, base_currency: str = "INR") -> Dict[str, Any]:
        """Fetch live ECB reference rates from Frankfurter, with 1-hour in-memory cache."""
        base = base_currency.upper()
        now = time.monotonic()

        # Return cached data if still fresh
        if base in self._cache:
            cached_at, cached_data = self._cache[base]
            if now - cached_at < self._cache_ttl:
                return cached_data

        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(
                    f"{self.base_url}/latest?from={base}",
                    timeout=5.0
                )
                if resp.status_code == 200:
                    data = resp.json()
                    self._cache[base] = (now, data)
                    return data
        except Exception:
            pass  # Fall through to stale cache or offline rates

        # Return stale cache if available
        if base in self._cache:
            _, stale = self._cache[base]
            return stale

        return {
            "amount": 1.0,
            "base": base,
            "date": "2026-11-05",
            "rates": self._offline_rates.get(base, self._offline_rates["INR"])
        }

    async def convert(self, amount: float, from_curr: str, to_curr: str) -> Dict[str, Any]:
        """Convert amounts and compute transparent spread savings vs standard bank markups."""
        from_c = from_curr.upper()
        to_c   = to_curr.upper()

        if from_c == to_c:
            return {
                "amount_source": amount, "currency_source": from_c,
                "amount_target": amount, "currency_target": to_c,
                "rate": 1.0,
                "traditional_bank_fee_estimate": 0.0,
                "eterpay_estimated_savings": 0.0
            }

        rates_data = await self.get_latest_rates(from_c)
        rate = rates_data.get("rates", {}).get(to_c, 1.0)
        target_amount = round(amount * rate, 2)

        # Traditional banks typically charge 3.5–5.0% in hidden DCC/FX spreads
        traditional_fee = round(amount * 0.042, 2)
        eterpay_fee     = round(amount * 0.004, 2)
        savings         = round(traditional_fee - eterpay_fee, 2)

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
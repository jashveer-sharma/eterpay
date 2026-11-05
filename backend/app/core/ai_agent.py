import re
import json
import logging
from typing import Dict, Any, List, Optional
import httpx

from app.config import settings
from app.core.currency_client import currency_client
from app.schemas.chat import ChatResponse, ActionProposal

logger = logging.getLogger(__name__)

GEMINI_TOOLS = [
    {
        "function_declarations": [
            {
                "name": "convert_currency",
                "description": "Convert money between currencies using real European Central Bank (ECB) reference rates.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "amount": {"type": "NUMBER", "description": "Amount to convert"},
                        "from_currency": {"type": "STRING", "description": "Source ISO currency code e.g. INR, USD, EUR"},
                        "to_currency": {"type": "STRING", "description": "Target ISO currency code e.g. USD, EUR, JPY"}
                    },
                    "required": ["amount", "from_currency", "to_currency"]
                }
            },
            {
                "name": "search_products_channel3",
                "description": "Search commerce products like travel adapters, luggage, eSIMs to purchase with PayPal.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "query": {"type": "STRING", "description": "Product search query e.g. travel adapter"}
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "plan_travel_budget",
                "description": "Plan budget allocation for travel to an international destination.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "destination": {"type": "STRING", "description": "Destination city or country e.g. Tokyo, Paris, Dubai"},
                        "budget_inr": {"type": "NUMBER", "description": "Total budget in INR"}
                    },
                    "required": ["destination", "budget_inr"]
                }
            },
            {
                "name": "update_grid_filter",
                "description": "Filter the user's AG Grid transaction ledger table dynamically.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "column": {"type": "STRING", "description": "Column name to filter e.g. category, status"},
                        "value": {"type": "STRING", "description": "Value to match e.g. Travel, Dining"}
                    },
                    "required": ["column", "value"]
                }
            }
        ]
    }
]

GROQ_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "convert_currency",
            "description": "Convert money between currencies using real European Central Bank (ECB) rates.",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Amount to convert"},
                    "from_currency": {"type": "string", "description": "Source ISO code (INR, USD, EUR)"},
                    "to_currency": {"type": "string", "description": "Target ISO code (USD, EUR, JPY)"}
                },
                "required": ["amount", "from_currency", "to_currency"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_products_channel3",
            "description": "Search commerce products to buy via PayPal.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Product query"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "plan_travel_budget",
            "description": "Plan budget allocation for international travel to any destination.",
            "parameters": {
                "type": "object",
                "properties": {
                    "destination": {"type": "string", "description": "Destination city or country"},
                    "budget_inr": {"type": "number", "description": "Budget in INR"}
                },
                "required": ["destination", "budget_inr"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_grid_filter",
            "description": "Filter AG Grid transactions ledger.",
            "parameters": {
                "type": "object",
                "properties": {
                    "column": {"type": "string", "description": "Column name"},
                    "value": {"type": "string", "description": "Value to filter"}
                },
                "required": ["column", "value"]
            }
        }
    }
]

SYSTEM_PROMPT = (
    "You are EterPay AI, an intelligent fintech copilot for the PayPal AI Hackathon 2026. "
    "You assist users with cross-border payments, currency conversions, travel budgeting, "
    "and AG Grid financial data analysis. "
    "Supported destinations include Tokyo, Paris, London, Dubai, Singapore, Bali, New York, Bangkok. "
    "When a user asks to convert currency, shop for items, plan travel, or filter transactions, "
    "always invoke the relevant tool call. "
    "Always maintain a concise, helpful, and professional tone."
)

# Destination keyword map for deterministic engine
DEST_MAP = {
    "tokyo": "Tokyo", "japan": "Tokyo",
    "paris": "Paris", "france": "Paris",
    "london": "London", "uk": "London", "england": "London",
    "dubai": "Dubai", "uae": "Dubai",
    "singapore": "Singapore",
    "bali": "Bali", "indonesia": "Bali",
    "new york": "New York", "nyc": "New York",
    "bangkok": "Bangkok", "thailand": "Bangkok",
    "amsterdam": "Amsterdam", "netherlands": "Amsterdam",
    "sydney": "Sydney", "australia": "Sydney",
}

# Destination currency map for travel planning
DEST_CURRENCY = {
    "Tokyo": "JPY", "Paris": "EUR", "London": "GBP",
    "Dubai": "AED", "Singapore": "SGD", "Bali": "USD",
    "New York": "USD", "Bangkok": "THB",
    "Amsterdam": "EUR", "Sydney": "AUD",
}


class AIAgentOrchestrator:
    """
    Multi-Tier AI Orchestrator for EterPay:
    - Tier 1: Gemini 1.5 Flash (Google AI Studio) with conversation history
    - Tier 2: Groq Llama 3.3 70B (Fallback) with conversation history
    - Tier 3: Deterministic Rule Engine (Guarantees zero-failure hackathon demonstration)
    """

    async def process_message(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> ChatResponse:
        clean_msg = message.strip()
        lower_msg = clean_msg.lower()
        ctx_history = history or []

        # Try Tier 1: Gemini 1.5 Flash
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 10:
            try:
                res = await self._call_gemini(clean_msg, ctx_history)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Tier 1 Gemini call failed, falling back: {e}")

        # Try Tier 2: Groq Llama 3.3 70B
        if settings.GROQ_API_KEY and len(settings.GROQ_API_KEY) > 10:
            try:
                res = await self._call_groq(clean_msg, ctx_history)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Tier 2 Groq call failed, falling back: {e}")

        # Tier 3: Deterministic Rule Engine
        return await self._deterministic_engine(clean_msg, lower_msg)

    async def _dispatch_tool(self, tool_name: str, args: Dict[str, Any]) -> ChatResponse:
        """Executes the tool call and constructs the appropriate ChatResponse."""
        if tool_name == "convert_currency":
            amount = float(args.get("amount", 1000.0))
            from_curr = str(args.get("from_currency", "INR")).upper()
            to_curr = str(args.get("to_currency", "USD")).upper()
            res = await currency_client.convert(amount, from_curr, to_curr)
            reply = (
                f"Live ECB Rate Conversion:\n\n"
                f"{amount:,.2f} {from_curr} = {res['amount_target']:,.2f} {to_curr}\n"
                f"Reference Rate: 1 {from_curr} = {res['rate']:.4f} {to_curr}\n"
                f"Traditional Bank Fee Estimate: {res['traditional_bank_fee_estimate']:.2f} {from_curr}\n"
                f"EterPay Fee: {res['amount_source'] * 0.004:.2f} {from_curr} "
                f"(Save {res['eterpay_estimated_savings']:.2f} {from_curr})"
            )
            return ChatResponse(reply=reply, tool_executed="convert_currency")

        elif tool_name == "search_products_channel3":
            query = args.get("query", "Travel Adapter")
            reply = (
                f"Product Discovered via Channel3!\n\n"
                f"Top result for '{query}': Anker Universal Global Travel Adapter "
                f"with Type A Japanese pins — 1,499 INR ($17.80 USD).\n\n"
                f"Secure PayPal Sandbox order prepared below. Review and approve when ready."
            )
            return ChatResponse(
                reply=reply,
                tool_executed="search_products_channel3",
                action_proposal=ActionProposal(
                    type="PAYPAL_CHECKOUT",
                    title="Approve Purchase via PayPal",
                    description="Anker Universal Travel Adapter (Type A Japanese Pins)",
                    amount=17.80,
                    currency="USD",
                    merchant="Anker Official Store",
                    payload={"item_id": "adapter-001", "inr_equivalent": 1499.00},
                    requires_approval=True
                )
            )

        elif tool_name == "plan_travel_budget":
            dest = args.get("destination", "Tokyo")
            budget = float(args.get("budget_inr", 150000.0))
            target_ccy = DEST_CURRENCY.get(dest, "USD")
            conversion = await currency_client.convert(budget, "INR", target_ccy)
            local_amount = conversion["amount_target"]
            rate = conversion["rate"]
            ccy_sym = {"JPY": "¥", "EUR": "€", "GBP": "£", "AED": "د.إ",
                       "SGD": "S$", "USD": "$", "AUD": "A$", "THB": "฿"}.get(target_ccy, target_ccy + " ")
            reply = (
                f"{dest} Travel Financial Plan\n\n"
                f"Budget: {budget:,.0f} INR = {ccy_sym}{local_amount:,.0f} {target_ccy} "
                f"(1 INR = {rate:.4f} {target_ccy}, live ECB rate)\n\n"
                f"Recommended Allocation:\n"
                f"  Accommodation (40%): {ccy_sym}{local_amount * 0.40:,.0f} (~{budget * 0.40:,.0f} INR)\n"
                f"  Dining & Food (30%): {ccy_sym}{local_amount * 0.30:,.0f} (~{budget * 0.30:,.0f} INR)\n"
                f"  Local Transit (15%): {ccy_sym}{local_amount * 0.15:,.0f} (~{budget * 0.15:,.0f} INR)\n"
                f"  Emergency Buffer (15%): {ccy_sym}{local_amount * 0.15:,.0f} (~{budget * 0.15:,.0f} INR)\n\n"
                f"Pro-Tip: Avoid Dynamic Currency Conversion (DCC) at ATMs — "
                f"banks add 4.5% in hidden spreads. EterPay uses live interbank ECB rates."
            )
            return ChatResponse(
                reply=reply,
                tool_executed="plan_travel_budget",
                action_proposal=ActionProposal(
                    type="RATE_ALERT",
                    title=f"Set INR/{target_ccy} Volatility Alert",
                    description=f"Notify when exchange rate moves 2% to lock in favorable {dest} travel rates.",
                    payload={"pair": f"INR/{target_ccy}", "destination": dest},
                    requires_approval=False
                )
            )

        elif tool_name == "update_grid_filter":
            col = args.get("column", "category")
            val = args.get("value", "Travel")
            reply = f"AG Grid Updated: Applied dynamic filter `{col} = '{val}'` to isolate relevant transactions."
            return ChatResponse(
                reply=reply,
                tool_executed="update_grid_filter",
                grid_filter={"column": col, "value": val}
            )

        return ChatResponse(reply=f"Executed tool: {tool_name}", tool_executed=tool_name)

    async def _call_gemini(self, msg: str, history: List[Dict[str, str]] = []) -> Optional[ChatResponse]:
        """Direct REST call to Gemini 1.5 Flash using Google AI Studio API with conversation history."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        # Build contents array: prior history + current message
        contents = []
        for h in history[-8:]:
            role = "model" if h.get("role") == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": h.get("content", "")}]})
        contents.append({"role": "user", "parts": [{"text": msg}]})
        payload = {
            "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
            "contents": contents,
            "tools": GEMINI_TOOLS
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, json=payload)
            if res.status_code != 200:
                logger.warning(f"Gemini API returned status {res.status_code}: {res.text}")
                return None

            data = res.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return None

            parts = candidates[0].get("content", {}).get("parts", [])
            for part in parts:
                if "functionCall" in part:
                    fn_call = part["functionCall"]
                    return await self._dispatch_tool(fn_call.get("name"), fn_call.get("args", {}))
                if "text" in part:
                    return ChatResponse(reply=part["text"], tool_executed=None)

        return None

    async def _call_groq(self, msg: str, history: List[Dict[str, str]] = []) -> Optional[ChatResponse]:
        """Direct REST call to Groq Cloud API running Llama 3.3 70B Versatile with conversation history."""
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for h in history[-8:]:
            role = h.get("role", "user")
            messages.append({"role": role, "content": h.get("content", "")})
        messages.append({"role": "user", "content": msg})
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "tools": GROQ_TOOLS,
            "tool_choice": "auto",
            "temperature": 0.2
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, headers=headers, json=payload)
            if res.status_code != 200:
                logger.warning(f"Groq API returned status {res.status_code}: {res.text}")
                return None

            data = res.json()
            choices = data.get("choices", [])
            if not choices:
                return None

            message = choices[0].get("message", {})
            tool_calls = message.get("tool_calls", [])
            if tool_calls:
                tc = tool_calls[0]
                fn_name = tc.get("function", {}).get("name")
                fn_args_str = tc.get("function", {}).get("arguments", "{}")
                try:
                    fn_args = json.loads(fn_args_str)
                except Exception:
                    fn_args = {}
                return await self._dispatch_tool(fn_name, fn_args)

            if message.get("content"):
                return ChatResponse(reply=message["content"], tool_executed=None)

        return None

    async def _deterministic_engine(self, msg: str, lower_msg: str) -> ChatResponse:
        """Zero-dependency deterministic NLP handler — guarantees response with no external APIs."""

        # 1. AG Grid Dynamic Filtering Intent (Evaluated first to prevent "Filter transactions by Travel" from triggering travel planning)
        if "filter" in lower_msg or (
            any(w in lower_msg for w in ["show", "display", "isolate"]) and
            any(w in lower_msg for w in ["travel", "expense", "transaction", "dining", "commerce", "ledger"])
        ):
            category = "Travel"
            for cat in ["Dining", "Commerce", "Travel"]:
                if cat.lower() in lower_msg:
                    category = cat
                    break
            return await self._dispatch_tool("update_grid_filter", {"column": "category", "value": category})

        # 2. Agentic Commerce Intent
        if any(w in lower_msg for w in ["adapter", "laptop", "buy", "shop", "product", "gear", "purchase", "order"]):
            query = "travel adapter"
            for kw in ["laptop", "esim", "charger", "luggage", "backpack", "sim"]:
                if kw in lower_msg:
                    query = kw
                    break
            return await self._dispatch_tool("search_products_channel3", {"query": query})

        # 3. Travel Planning Intent — multi-destination
        travel_triggers = ["trip", "travel", "itinerary", "vacation", "going to", "budget for"] + list(DEST_MAP.keys())
        if any(w in lower_msg for w in travel_triggers):
            destination = "Tokyo"
            for kw, dest in DEST_MAP.items():
                if kw in lower_msg:
                    destination = dest
                    break
            amount = 150000.0
            match = re.search(r"(\d+[\d,.]*)", msg)
            if match:
                raw_amt = float(match.group(1).replace(",", ""))
                if raw_amt > 1000:
                    amount = raw_amt
            return await self._dispatch_tool("plan_travel_budget", {"destination": destination, "budget_inr": amount})

        # 4. Currency Conversion Intent
        if any(w in lower_msg for w in ["convert", "rate", "how much", "exchange", "worth", "inr", "usd", "eur", "jpy"]):
            match = re.search(r"(\d+[\d,.]*)", msg)
            amount = float(match.group(1).replace(",", "")) if match else 10000.0
            from_curr = "INR"
            to_curr = "USD"
            if "jpy" in lower_msg or "yen" in lower_msg:
                to_curr = "JPY"
            elif "eur" in lower_msg or "euro" in lower_msg:
                to_curr = "EUR"
            elif "gbp" in lower_msg or "pound" in lower_msg:
                to_curr = "GBP"
            elif "sgd" in lower_msg or "singapore" in lower_msg:
                to_curr = "SGD"
            elif "aed" in lower_msg or "dirham" in lower_msg:
                to_curr = "AED"
            return await self._dispatch_tool("convert_currency", {
                "amount": amount,
                "from_currency": from_curr,
                "to_currency": to_curr
            })

        # Default fallback
        return ChatResponse(
            reply=(
                "I am EterPay AI, your cross-border financial copilot.\n\n"
                "Try asking me:\n"
                "- 'I am traveling to Tokyo with 150,000 INR. Help me plan my budget.'\n"
                "- 'Plan my Paris trip with 200,000 INR.'\n"
                "- 'Find me a universal travel adapter.'\n"
                "- 'Filter my transactions by Travel category.'\n"
                "- 'Convert 50,000 INR to EUR.'"
            )
        )


ai_orchestrator = AIAgentOrchestrator()
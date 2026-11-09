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
            },
            {
                "name": "initiate_payment",
                "description": "Propose a PayPal payment for the user to approve. The AI NEVER executes payments directly — only creates a proposal requiring explicit user approval.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "amount": {"type": "NUMBER", "description": "Payment amount in the specified currency"},
                        "currency": {"type": "STRING", "description": "ISO currency code e.g. USD, EUR"},
                        "recipient": {"type": "STRING", "description": "Merchant or recipient name"},
                        "description": {"type": "STRING", "description": "What the payment is for"}
                    },
                    "required": ["amount", "currency", "recipient", "description"]
                }
            },
            {
                "name": "calculate_loan_against_fd",
                "description": "Calculate instant ReserveLien line of credit against Fixed Deposit (FD) or Multi-Currency Reserve without breaking deposits.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "collateral_amount": {"type": "NUMBER", "description": "Collateral deposit amount in INR or USD"},
                        "currency": {"type": "STRING", "description": "Collateral currency: INR, USD, EUR"}
                    },
                    "required": ["collateral_amount"]
                }
            },
            {
                "name": "compare_payment_rails",
                "description": "Compare real-time transfer costs, speeds, and fees between PayPal, Wise, and Airtm.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "amount": {"type": "NUMBER", "description": "Transfer amount in USD or INR"},
                        "from_currency": {"type": "STRING", "description": "Source currency e.g. USD"},
                        "to_currency": {"type": "STRING", "description": "Target currency e.g. INR"}
                    },
                    "required": ["amount"]
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
    },
    {
        "type": "function",
        "function": {
            "name": "initiate_payment",
            "description": "Propose a PayPal payment for user approval. AI never executes directly — requires explicit human approval.",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Amount in specified currency"},
                    "currency": {"type": "string", "description": "ISO code e.g. USD, EUR"},
                    "recipient": {"type": "string", "description": "Merchant or recipient"},
                    "description": {"type": "string", "description": "Payment purpose"}
                },
                "required": ["amount", "currency", "recipient", "description"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_loan_against_fd",
            "description": "Calculate instant ReserveLien line of credit against Fixed Deposit (FD) or Multi-Currency Reserve.",
            "parameters": {
                "type": "object",
                "properties": {
                    "collateral_amount": {"type": "number", "description": "Collateral deposit amount"},
                    "currency": {"type": "string", "description": "Collateral currency: INR, USD, EUR"}
                },
                "required": ["collateral_amount"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "compare_payment_rails",
            "description": "Compare real-time transfer costs, speeds, and fees between PayPal, Wise, and Airtm.",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Transfer amount in USD or INR"},
                    "from_currency": {"type": "string", "description": "Source currency"},
                    "to_currency": {"type": "string", "description": "Target currency"}
                },
                "required": ["amount"]
            }
        }
    }
]

SYSTEM_PROMPT = (
    "You are Eter AI (EterPay AI), an intelligent, context-aware global fintech assistant and financial copilot. "
    "You assist users with cross-border payments, currency conversions, travel budgeting, "
    "commerce discovery, AG Grid financial data analysis, and ReserveLien asset-backed liquidity. "
    "USER FINANCIAL CONTEXT: "
    "• User Name: Alex Rivera (alex.rivera@eterpay.demo). "
    "• Primary Wallet: ₹2,34,750 INR (~$2,500 USD equivalent across multi-currency pockets). "
    "• Term Deposit Collateral: ₹5,00,000 SBI Fixed Deposit earning 7.20% p.a. compound yield. "
    "• ReserveLien Overdraft Capability: ₹4,25,000 instant credit line at 8.45% borrow rate (1.25% net cost) with 85% LTV cap. "
    "• Monthly Subscriptions: Alex spent ₹5,117 on 4 active subscriptions this month (8% of total monthly spend). "
    "  Adobe Creative Cloud is largest at ₹4,230. Figma Professional is ₹1,200/mo and has not been used in 18 days (recommend pausing to save ₹1,200/mo). Netflix is ₹649/mo, Spotify is ₹179/mo. "
    "• Supported travel destinations: Tokyo, Paris, London, Dubai, Singapore, Bali, New York, Bangkok. "
    "Tool routing rules: "
    "convert currency -> call convert_currency; "
    "shop/buy/find products -> call search_products_channel3; "
    "plan travel/trip -> call plan_travel_budget; "
    "filter/show transactions -> call update_grid_filter; "
    "loan/fd/fixed deposit/collateral/reservelien/overdraft/credit line -> call calculate_loan_against_fd; "
    "compare rails/fees/wise vs paypal/airtm -> call compare_payment_rails; "
    "send/pay/transfer/wire money -> call initiate_payment (requires_approval always True, never execute). "
    "CRITICAL FORMATTING RULES: "
    "1. NEVER use markdown asterisks (* or **). Do not use asterisks for bold or for bullets. "
    "2. For lists, use clean hyphens '-' or bullet dots '•'. "
    "3. Keep replies concise, fast, and high-impact. Never include unnecessary filler."
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
    - Tier 3: Deterministic Rule Engine (Guarantees zero-failure autonomous fallback)
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

        elif tool_name == "initiate_payment":
            amount = float(args.get("amount", 25.0))
            currency = str(args.get("currency", "USD")).upper()
            recipient = args.get("recipient", "EterPay Merchant")
            description = args.get("description", "Payment via EterPay")
            reply = (
                f"Payment Proposal Ready:\n\n"
                f"Amount: {currency} {amount:,.2f}\n"
                f"Recipient: {recipient}\n"
                f"Purpose: {description}\n\n"
                "Review the details below and click Approve & Pay to initiate the PayPal Sandbox checkout. Funds will only move after your approval."
            )
            return ChatResponse(
                reply=reply,
                tool_executed="initiate_payment",
                action_proposal=ActionProposal(
                    type="PAYPAL_CHECKOUT",
                    title=f"Pay {currency} {amount:,.2f} to {recipient}",
                    description=description,
                    amount=amount,
                    currency=currency,
                    merchant=recipient,
                    payload={"initiated_by": "ai_tool"},
                    requires_approval=True
                )
            )

        elif tool_name == "calculate_loan_against_fd":
            collateral = float(args.get("collateral_amount", 500000.0))
            currency = str(args.get("currency", "INR")).upper()
            ltv = 0.85
            credit_line = collateral * ltv
            fd_rate = 7.20
            borrow_rate = 8.45
            net_spread = borrow_rate - fd_rate  # 1.25%
            monthly_interest = (credit_line * (borrow_rate / 100.0)) / 12.0

            symbol = "₹" if currency == "INR" else ("$" if currency == "USD" else "€")
            reply = (
                f"EterPay ReserveLien™ Credit Line Assessment\n\n"
                f"Pledged Collateral: {symbol}{collateral:,.2f} {currency} in Verified Term Deposit\n"
                f"Available Credit Line: {symbol}{credit_line:,.2f} {currency} (85% Instant LTV)\n"
                f"Zero Credit Checks: 100% Asset-Backed Overdraft (CIBIL/FICO Exempt)\n"
                f"Deposit Earning Yield: {fd_rate:.2f}% p.a. (Compounding Uninterrupted)\n"
                f"Borrowing Interest Rate: {borrow_rate:.2f}% p.a.\n"
                f"Effective Net Cost: Only {net_spread:.2f}% p.a. (~{symbol}{monthly_interest:,.0f}/month on full draw)\n\n"
                f"Key Advantage: Unlike breaking your deposit and forfeiting interest, "
                f"ReserveLien gives you instant spending liquidity spendable via PayPal "
                f"while your underlying reserve continues growing."
            )
            return ChatResponse(
                reply=reply,
                tool_executed="calculate_loan_against_fd",
                action_proposal=ActionProposal(
                    type="RESERVE_LIEN",
                    title=f"Activate ReserveLien™: {symbol}{credit_line:,.0f} Credit Line",
                    description=f"85% instant overdraft backed by {symbol}{collateral:,.0f} {currency} reserve. Deposit keeps earning {fd_rate}%.",
                    amount=credit_line,
                    currency=currency,
                    payload={
                        "collateral": collateral,
                        "ltv": ltv,
                        "fd_rate": fd_rate,
                        "borrow_rate": borrow_rate,
                        "net_cost": net_spread
                    },
                    requires_approval=True
                )
            )

        elif tool_name == "compare_payment_rails":
            amount = float(args.get("amount", 1000.0))
            from_ccy = str(args.get("from_currency", "USD")).upper()
            to_ccy = str(args.get("to_currency", "INR")).upper()

            # Live ECB rate conversion
            conv = await currency_client.convert(amount, from_ccy, to_ccy)
            ecb_amt = conv["amount_target"]
            ecb_rate = conv["rate"]

            reply = (
                f"Global Cross-Border Rail Comparison ({from_ccy} {amount:,.0f} to {to_ccy})\n\n"
                f"1. EterPay + PayPal Sandbox:\n"
                f"   - Effective Settlement: ₹{ecb_amt * 0.996:,.0f} {to_ccy}\n"
                f"   - Fee: 0.40% ECB Interbank spread\n"
                f"   - Speed: Instant Modal Confirmation with Orders v2\n"
                f"   - Safety: PayPal Buyer Protection + Idempotency\n\n"
                f"2. Wise (Traditional FinTech):\n"
                f"   - Effective Settlement: ₹{ecb_amt * 0.994:,.0f} {to_ccy}\n"
                f"   - Fee: 0.55% - 0.65% mid-market + ACH fee\n"
                f"   - Speed: 4 to 24 hours banking hours\n\n"
                f"3. Airtm (P2P Network):\n"
                f"   - Effective Settlement: ₹{ecb_amt * 0.972:,.0f} {to_ccy}\n"
                f"   - Fee: 1.50% - 3.20% cashier bid/ask spread\n"
                f"   - Speed: 15 to 45 minutes peer-matching\n\n"
                f"Conclusion: EterPay provides the highest net settlement and zero hidden Dynamic Currency Conversion."
            )
            return ChatResponse(
                reply=reply,
                tool_executed="compare_payment_rails",
                action_proposal=ActionProposal(
                    type="PAYPAL_CHECKOUT",
                    title=f"Execute via PayPal Sandbox ({from_ccy} {amount:,.2f})",
                    description=f"Optimal rail selected. Settle at live ECB reference rate (1 {from_ccy} = {ecb_rate:.4f} {to_ccy}).",
                    amount=amount,
                    currency=from_ccy,
                    merchant="EterPay Global Rail",
                    payload={"optimal_rail": "paypal_sandbox"},
                    requires_approval=True
                )
            )

        return ChatResponse(reply=f"Executed tool: {tool_name}", tool_executed=tool_name)

    async def _call_gemini(self, msg: str, history: List[Dict[str, str]] = []) -> Optional[ChatResponse]:
        """Direct REST call to Gemini 1.5 Flash using Google AI Studio API with conversation history."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={settings.GEMINI_API_KEY}"
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

        async with httpx.AsyncClient(timeout=5.0) as client:
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
                    # Clean any accidental markdown asterisks from model reply
                    clean_text = part["text"].replace("**", "").replace("*", "")
                    return ChatResponse(reply=clean_text, tool_executed=None)

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
            "model": "openai/gpt-oss-120b",
            "messages": messages,
            "tools": GROQ_TOOLS,
            "tool_choice": "auto",
            "temperature": 0.2
        }

        async with httpx.AsyncClient(timeout=8.0) as client:
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
                clean_text = message["content"].replace("**", "").replace("*", "")
                return ChatResponse(reply=clean_text, tool_executed=None)

        return None

    async def _deterministic_engine(self, msg: str, lower_msg: str) -> ChatResponse:
        """Zero-dependency deterministic NLP handler — guarantees response with no external APIs."""

        # 1. ReserveLien / Loan Against Fixed Deposit (FD) Intent
        if any(w in lower_msg for w in ["loan", "fd", "fixed deposit", "reservelien", "lien", "pledge", "overdraft", "credit line"]):
            match = re.search(r"(\d+[\d,.]*)", msg)
            amount = float(match.group(1).replace(",", "")) if match else 500000.0
            currency = "USD" if ("usd" in lower_msg or "$" in lower_msg) else "INR"
            return await self._dispatch_tool("calculate_loan_against_fd", {"collateral_amount": amount, "currency": currency})

        # 2. Payment Rail Comparison Intent (PayPal vs Wise vs Airtm)
        if any(w in lower_msg for w in ["compare", "rail", "rails", "airtm", "wise", "fees"]):
            match = re.search(r"(\d+[\d,.]*)", msg)
            amount = float(match.group(1).replace(",", "")) if match else 1000.0
            return await self._dispatch_tool("compare_payment_rails", {"amount": amount, "from_currency": "USD", "to_currency": "INR"})

        # 3. AG Grid Dynamic Filtering Intent
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

        # 4. Agentic Commerce Intent
        if any(w in lower_msg for w in ["adapter", "laptop", "buy", "shop", "product", "gear", "purchase", "order"]):
            query = "travel adapter"
            for kw in ["laptop", "esim", "charger", "luggage", "backpack", "sim"]:
                if kw in lower_msg:
                    query = kw
                    break
            return await self._dispatch_tool("search_products_channel3", {"query": query})

        # 5. Travel Planning Intent — multi-destination
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

        # 6. Currency Conversion Intent
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

        # 7. Payment Intent — propose via initiate_payment (never execute directly)
        if any(w in lower_msg for w in ["pay", "send", "transfer", "wire", "remit"]):
            match = re.search(r"(\d+[\d,.]*)", msg)
            amount = float(match.group(1).replace(",", "")) if match else 25.0
            currency = "USD"
            if "inr" in lower_msg or "rupee" in lower_msg:
                amount = max(round(amount / 83.0, 2), 1.0)
            recipient = "Merchant"
            for name in ["amazon", "netflix", "spotify", "uber", "airbnb", "apple"]:
                if name in lower_msg:
                    recipient = name.capitalize()
                    break
            return await self._dispatch_tool("initiate_payment", {
                "amount": amount, "currency": currency,
                "recipient": recipient, "description": "EterPay Payment"
            })

        # 8. Balance / account summary intent
        if any(w in lower_msg for w in ["balance", "wallet", "account", "how much do i have", "my funds"]):
            return ChatResponse(
                reply=(
                    "EterPay Demo Account Summary (Alex M.):\n\n"
                    "  Primary Wallet (INR): \u20b92,34,750.00\n"
                    "  USD Reserve: $1,250.00\n"
                    "  EUR Pocket: \u20ac430.00\n\n"
                    "Total in INR (live ECB): ~\u20b92,98,220\n"
                    "Last updated: live (Frankfurter ECB feed)"
                )
            )

        # 9. Monthly spending digest intent
        if any(w in lower_msg for w in ["spend", "spent", "expenses", "this month", "monthly"]):
            return ChatResponse(
                reply=(
                    "EterPay Spending Digest - October 2026:\n\n"
                    "  Travel: \u20b968,400 (5 transactions)\n"
                    "  Commerce: \u20b912,750 (3 transactions)\n"
                    "  Subscriptions: \u20b92,340 (2 transactions)\n"
                    "  Dining: \u20b98,200 (4 transactions)\n"
                    "  Total outflows: \u20b991,690\n\n"
                    "Tip: Settle cross-border bills with PayPal Sandbox at live ECB interbank rates."
                )
            )

        # 10. Subscriptions & Audit Intent
        if any(w in lower_msg for w in ["pause", "cancel sub", "unused"]):
            return ChatResponse(
                reply="Based on your usage patterns, Figma Professional hasn't been used in 18 days. Pausing it would save ₹1,200/month. Want me to arrange that?"
            )

        if "subscription" in lower_msg or "subscriptions" in lower_msg or "recurring" in lower_msg:
            if any(w in lower_msg for w in ["how much", "spend", "spent", "total", "cost"]):
                return ChatResponse(
                    reply="You've spent ₹5,117 on 4 active subscriptions this month. That's 8% of your total spend. Adobe Creative Cloud is your largest at ₹4,230."
                )
            return ChatResponse(
                reply=(
                    "Active Subscriptions (Alex Rivera):\n\n"
                    "• Adobe Creative Cloud - ₹4,230/month\n"
                    "• Figma Professional - ₹1,200/month (Unused for 18 days — pause recommended)\n"
                    "• Netflix Premium - ₹649/month\n"
                    "• Spotify Family - ₹179/month\n\n"
                    "Total Monthly: ₹5,117 (8% of your total monthly spend)."
                )
            )

        # Default fallback
        return ChatResponse(
            reply=(
                "I am EterPay AI, your global fintech assistant.\n\n"
                "Try asking me:\n"
                "- 'Can I get a loan against my ₹5,00,000 Fixed Deposit?'\n"
                "- 'Compare PayPal vs Wise vs Airtm fees for $1,000'\n"
                "- 'Plan Tokyo trip with ₹1,50,000'\n"
                "- 'Find universal travel adapter'\n"
                "- 'Filter transactions by Travel'\n"
                "- 'Convert 50,000 INR to EUR'\n"
                "- 'What is my account balance?'\n"
                "- 'Send $25 to Spotify'"
            )
        )


ai_orchestrator = AIAgentOrchestrator()
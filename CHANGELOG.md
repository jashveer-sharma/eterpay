# Changelog — EterPay

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.3.0] — 2026-11-05 — Full-Stack MVP + Hallmark Dusk Redesign

### Added
- **Hallmark Dusk full redesign** applied to `frontend/src/app/page.tsx`:
  - Smoked glass surfaces (`.hallmark-glass`, `.hallmark-glass-lit`)
  - Periwinkle signal colour + ACC neon green (`#00e676`) accent tokens
  - Dark slate background (`#0e1017`) + radial gradient hero
  - `0 FAIL, 1 REFLEX (waived)` on Hallmark sloplint
- **Multi-tier AI orchestrator** (`app/core/ai_agent.py`):
  - Primary: Gemini 1.5 Flash REST (free tier)
  - Fallback: Groq Llama 3.3 70B REST
  - Deterministic rule engine (zero API key fallback)
  - Tool dispatch: `convert_currency`, `search_products_channel3`, `plan_travel_budget`, `update_grid_filter`
- **PayPal Orders v2 sandbox integration** (`app/core/paypal_client.py`):
  - Mock mode when env keys absent; real sandbox when keys set
  - UUIDv4 idempotency enforcement on every order creation
  - Deterministic human gate: AI → Backend validation → User "Approve" click → PayPal modal → Capture → Ledger
- **FastAPI backend** with full endpoint coverage:
  - `/health`, `/api/chat`, `/api/currency/rates`, `/api/currency/convert`
  - `/api/paypal/create-order`, `/api/paypal/capture-order`, `/api/paypal/webhook`
  - `/api/commerce/search`, `/api/invest/portfolio`
- **AG Grid Community v32** transaction ledger:
  - AI-driven dynamic filter hook (`update_grid_filter` tool)
  - Custom `StatusBadge` cell renderer, inline SVG sparklines
  - Category filter capsules, pagination
- **Live ECB FX rates** via Frankfurter API (zero API key)
- **Interactive currency calculator** with live rate lookup
- **Macro FX stress-test simulator** with range slider (simulation badge mandatory)
- **Agentic Commerce tab** (Channel3 fallback catalog — travel products)
- **Simulated currency portfolio** with sparklines and P&L indicators
- **Hallmark skill** installed at `.agents/skills/hallmark/` (Nutlope/hallmark)
- **GitHub Actions CI** (`/.github/workflows/ci.yml`): pytest + Next.js build on push
- **Render IaC** (`render.yaml`) for one-click Render.com deployment
- **Environment templates**: `backend/.env.example`, `frontend/.env.local.example`
- **Pytest suite** 10/10 tests passing (Python 3.11, pytest-asyncio)

### Fixed
- `ClientSideRowModelModule` → `CommunityFeaturesModule` (AG Grid v32 breaking change)
- `autoprefixer` missing from frontend `node_modules`
- `CreateOrderResponse` Pydantic schema: added `id` field alias for PayPal SDK
- PowerShell `Set-Content` encoding corruption → `WriteAllText(..., UTF8)`
- Spread operator `...` corrupted to `…` by PowerShell replace → targeted restore

### Changed
- Tailwind config: all named design tokens mapped to CSS custom properties
- `globals.css`: Hallmark Dusk `:root` token block; `overflow-x: clip` on html/body

---

## [0.2.0] — 2026-11-04 — Backend Foundation + CI/CD

### Added
- Full FastAPI application structure with Pydantic v2 schemas
- Safety engine: spend limits (₹25,000 / \$300 per order)
- Frankfurter ECB currency client
- GitHub repository `jashveer-sharma/eterpay` created
- `develop` and `main` branches established
- GitHub Actions CI pipeline

---

## [0.1.0] — 2026-11-04 — Project Initialisation

### Added
- Initialized workspace architecture and root configuration files.
- Added MIT License and `.gitignore` preventing secret leakage.
- Created Antigravity execution rules (`GEMINI.md`) and `.agents/mcp_config.json`.
- Implemented 5 native Antigravity custom skills:
  - `paypal-integration` (Orders v2, capture, webhooks)
  - `ag-grid-fintech` (Quartz dark theme, custom renderers, sparklines, AI filter hook)
  - `free-ai-orchestration` (Gemini 1.5 Flash + Groq Llama 3.3 70B fallback)
  - `token-optimization` (targeted surgical diffs, bounded reads)
  - `fintech-security-audit` (idempotency, single-order caps, PCI-DSS boundaries)
- Created 11 core architecture and tracking documents in `docs/`.
- Configured GitHub branching strategy and version control guidelines.

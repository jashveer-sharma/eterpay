# Task Tracker — EterPay

## Sprint 1: Setup & Environment (Day 1) — Complete ✅
- [x] Configure Antigravity workspace rules (`GEMINI.md`)
- [x] Create native custom skills (`.agents/skills/`)
- [x] Configure MCP server endpoints (`.agents/mcp_config.json`)
- [x] Create project documentation repository (`docs/`)
- [x] Document environment & installation prerequisites (`INSTALLATION_TRACKER.md`)
- [x] Node.js v26.13.0 & Python 3.11.18 installed and verified
- [x] Initialize Next.js 15 frontend application with App Router & TypeScript
- [x] Initialize FastAPI backend application with Pydantic v2 schemas

## Sprint 2: Core Integrations (Days 2-4) — Complete ✅
- [x] PayPal Orders v2 API create & capture flow (`/api/paypal/create-order`, `/api/paypal/capture-order`)
- [x] UUIDv4 Idempotency enforcement on every payment creation
- [x] Server-side spend limit safety engine (₹25,000 INR / $300 USD)
- [x] Webhook listener endpoint (`/api/paypal/webhook`)
- [x] PayPal JS SDK checkout button component with `@paypal/react-paypal-js`
- [x] Deterministic Human Approval Gate (`ActionProposal` component)
- [x] AG Grid Community v32 transaction audit ledger with sorting & pagination
- [x] In-cell SVG sparklines and `StatusBadge` custom renderers
- [x] AI-driven dynamic AG Grid filtering hook (`update_grid_filter` tool call)
- [x] Multi-tier AI Orchestration: Gemini 1.5 Flash -> Groq Llama 3.3 70B -> Deterministic rule engine
- [x] Conversation history passed from frontend to backend
- [x] Multi-destination travel planning (Tokyo, Paris, London, Dubai, Singapore, Bali, New York, Bangkok)
- [x] Live ECB currency exchange rates via Frankfurter API with 1-hour in-memory cache
- [x] Interactive live currency calculator with transparent bank markup fee comparison

## Sprint 3: Polish & Submission Readiness (Days 5-8) — Complete ✅
- [x] Channel3 agentic shopping tool with product discovery and local fallback catalog
- [x] Travel gear checkout integration ("Prepare Checkout" -> AI proposal -> PayPal button)
- [x] Investment simulation & Macro FX stress-testing simulator (-20% to +20% shock slider)
- [x] Mandatory FEMA / Educational Simulation warning badges rendered permanently
- [x] Hallmark Dusk full redesign applied to frontend (`globals.css` + `page.tsx`)
- [x] Hallmark sloplint audit passed: **0 FAIL, 1 WARN (F24)**
- [x] Next.js production build verified: **0 errors, 4/4 static pages generated**
- [x] Pytest backend suite verified: **10/10 tests passing**
- [x] Render cloud deployment IaC configured (`render.yaml`)
- [x] Environment variable templates documented (`.env.example`, `.env.local.example`)
- [x] Hackathon 2m45s demo video recording script (`docs/DEMO_SCRIPT.md`)
- [x] Comprehensive deployment walkthrough (`docs/DEPLOYMENT.md`)
- [x] Git version control: `develop` & `main` branches synchronized, tagged `v0.3.0`

## Remaining Actions for Final Submission
- [ ] Add personal PayPal sandbox credentials & Gemini API key to `backend/.env` for live sandbox demo
- [ ] Connect repo to Render.com dashboard using Blueprint (`render.yaml`)
- [ ] Record 2m45s video walkthrough following `docs/DEMO_SCRIPT.md`
- [ ] Submit on Devpost with video link, repo URL, and live Render URL

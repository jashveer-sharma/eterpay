# EterPay — Installation & Environment Tracker (Phase 3)

> **Last Updated:** November 5, 2026  
> **Status:** Environment Audited · Git & GitHub Verified · Awaiting Host Runtimes (Node.js & Python)

---

## 1. Installation Status Register

| Component | Category | Status | Target Version | Configuration / Location | Action Required |
|---|---|---|---|---|---|
| **Git Engine** | VCS | ✅ **VERIFIED** | v2.47.1 | `$LOCALAPPDATA\Programs\Git\cmd` | None (Operational) |
| **GitHub CLI (`gh`)** | Dev Tool | ✅ **VERIFIED** | v2.62.0 | Authenticated as `jashveer-sharma` | None (Operational) |
| **GitHub Remote** | VCS | ✅ **VERIFIED** | Remote connected | `https://github.com/jashveer-sharma/eterpay.git` | None (Operational) |
| **Antigravity Rules** | Governance | ✅ **CONFIGURED** | `GEMINI.md` | Workspace root rules with security gates | None (Active) |
| **Antigravity Custom Skills** | AI Skills | ✅ **CONFIGURED** | 5 Custom Skills | `.agents/skills/` (PayPal, AG Grid, AI, Security, Token) | None (Active) |
| **MCP Server Config** | Agent Tooling | ✅ **CONFIGURED** | JSON v1.0 | `.agents/mcp_config.json` (PayPal MCP & Context7) | Run via Node when runtime is active |
| **Node.js & npm** | Host Runtime | ✅ **VERIFIED** | v26.13.0 / npm 11.20.0 | Global path `C:\Program Files\nodejs` | None (Operational) |
| **Python & pip** | Host Runtime | ✅ **VERIFIED** | Python 3.11.18 | User path via `uv` at `C:\Users\Admin\.local\bin` | None (Operational) |
| **FastAPI Backend Core** | Backend | ✅ **VERIFIED** | FastAPI 0.162.0 | `backend/.venv` active with all 26 dependencies | None (Operational) |
| **Next.js 15 Frontend** | Frontend | ✅ **CONFIGURED** | Next.js 15.0+ | `frontend/src/` committed on `develop` branch | Ready for `npm install` |
| **PayPal Sandbox Orders v2** | Payments | ⏳ **NEEDS API KEY** | REST API v2 | Implemented in `backend/app/core/paypal_client.py` | Add Sandbox credentials to `.env` |
| **Frankfurter ECB FX API** | Market Rates | ✅ **VERIFIED** | Public REST | 100% free European Central Bank live rates | None (Operational) |
| **Google Gemini Free API** | AI Engine | ⏳ **NEEDS API KEY** | Gemini 1.5 Flash | Free tier: 15 RPM / 1M TPM / 1500 RPD | Add `GEMINI_API_KEY` to `.env` |
| **Groq Cloud Free API** | Fallback AI | ⏳ **NEEDS API KEY** | Llama 3.3 70B | Free tier: 30 RPM / 12K TPM / 1000 RPD | Add `GROQ_API_KEY` to `.env` |
| **Channel3 API** | Commerce | ⏳ **NEEDS API KEY** | Promo Hackathon | Promo `PAYPAL-HACKATHON-2026` + local fallback | Add `CHANNEL3_API_KEY` to `.env` |
| **Docker Engine** | Infra | ⚪ **NOT REQUIRED** | N/A | Excluded to conserve 4GB host RAM budget | None (Use native processes) |

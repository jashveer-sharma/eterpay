# EterPay — Installation & Environment Tracker

> **Project:** EterPay (PayPal Build What's Next with PayPal and AI Hackathon 2026)  
> **Last Updated:** November 5, 2026  
> **Status:** Environment Configured & Documented — Awaiting Host Runtimes (Node.js & Python)

---

## 1. Environment & Tools Status Table

| Resource | Category | Status | Version / Target | Configuration Details | User Action Required |
|---|---|---|---|---|---|
| **Antigravity Workspace Rules** | AI Governance | ✅ **Configured** | Native `GEMINI.md` | Configured with token optimization, safety limits, AG Grid rules | None (Active) |
| **Antigravity Custom Skills** | AI Skills | ✅ **Configured** | v1.0.0 | 5 native skills configured in `.agents/skills/` | None (Active) |
| **MCP Server Config** | Agent Tooling | ✅ **Configured** | JSON v1.0 | `.agents/mcp_config.json` configured for PayPal MCP & Context7 | Run npx when Node is installed |
| **Context7 Plugin** | Documentation | ⏳ **Pending Approval** | Antigravity Partner | In marketplace catalog: `antigravity-plugins-partners/plugin/context7` | Install from plugin card in chat |
| **Node.js & npm** | Host Runtime | ⚠️ **Blocked (Host)** | Target: Node.js LTS (v20+) | Not found in host system `PATH` | Run 1-click install command (Action 1) |
| **Python & pip** | Host Runtime | ⚠️ **Blocked (Host)** | Target: Python 3.11+ | Not found in host system `PATH` | Run 1-click install command (Action 2) |
| **Git** | Version Control | ✅ **Installed** | MinGit v2.47.1 | Installed in `$LOCALAPPDATA\Programs\Git\cmd`, added to User PATH | None (Operational) |
| **GitHub CLI (`gh`)** | GitHub Remote | ⏳ **Awaiting Login** | v2.62.0 | Installed in `$LOCALAPPDATA\Programs\gh`, added to User PATH | Run `gh auth login` (Action 3) |
| **PayPal JS SDK (`@paypal/react-paypal-js`)** | Frontend Payments | ⏳ **Ready to Install** | v8.8+ | Ready to install via `npm i` once Node.js is present | Automatic after Action 1 |
| **PayPal Agent Toolkit (`@paypal/agent-toolkit`)** | AI Payments | ⏳ **Ready to Install** | v0.4+ | Ready to install via `npm i` once Node.js is present | Automatic after Action 1 |
| **AG Grid React & Community** | Data Visualization | ⏳ **Ready to Install** | v32.3+ | Ready to install via `npm i` once Node.js is present | Automatic after Action 1 |
| **FastAPI & Uvicorn** | Backend Server | ⏳ **Ready to Install** | v0.115+ | Ready to install via `pip install -r requirements.txt` | Automatic after Action 2 |
| **Frankfurter ECB Currency API** | Market FX Data | ✅ **Verified** | Public REST | Zero API key needed; 100% free European Central Bank rates | None (Active & Verified) |
| **Channel3 API** | Agentic Commerce | ⏳ **Pending Key** | REST API v1 | Promo code: `PAYPAL-HACKATHON-2026`; local fallback configured | Obtain API key from trychannel3.com |
| **Google Gemini Free API** | AI Model | ⏳ **Pending Key** | Gemini 1.5 Flash | Free tier: 15 RPM, 1M TPM, 1500 RPD via Google AI Studio | Add `GEMINI_API_KEY` to `.env` |
| **Groq Cloud Free API** | AI Model Fallback | ⏳ **Pending Key** | Llama 3.3 70B | Free tier: 30 RPM, 12K TPM, 1000 RPD via Groq Console | Add `GROQ_API_KEY` to `.env` |

---

## 2. Actionable Step-by-Step PowerShell Setup for Host Machine

To enable building and running Next.js and FastAPI locally, execute the following commands in an **Administrator PowerShell** window:

### Action 1: Install Node.js LTS & Git (via Winget or Official Installers)
Open PowerShell as Administrator and run:
```powershell
# Using Winget (if available):
winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
winget install Git.Git --silent --accept-source-agreements --accept-package-agreements

# OR manual direct downloads:
# Node.js: https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi
# Git: https://github.com/git-for-windows/git/releases/download/v2.47.0.windows.1/Git-2.47.0-64-bit.exe
```

### Action 2: Install Python 3.11 / 3.12
```powershell
winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements
# Ensure "Add Python to PATH" is enabled
```

### Action 3: Verify Environment After Terminal Restart
```powershell
node -v
npm -v
python --version
git --version
```

---

## 3. Configured Project Documentation & Rules

The following architectural files are live and active in the repository:
1. `GEMINI.md` — Core Antigravity execution rules, security guardrails, token limits.
2. `.agents/mcp_config.json` — Pre-configured MCP definitions for PayPal and Context7.
3. `.agents/skills/` — 5 custom, progressive-disclosure Antigravity skills.
4. `docs/` — 11 living architecture and tracking documents.
5. `.env.example` — Secure environment template.

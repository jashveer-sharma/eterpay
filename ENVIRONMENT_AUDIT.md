# EterPay — Development Environment Audit (Phase 2)

> **Audit Date:** November 5, 2026  
> **Auditor:** Technical Architect & DevOps Engineer  
> **Target Event:** PayPal Build What's Next with PayPal and AI Hackathon 2026

---

## 1. System Hardware & Resource Metrics

| Metric | Measured Value | Architectural Implication |
|---|---|---|
| **Operating System** | Microsoft Windows 10 Home (Build 19045, 64-bit) | Fully compatible with Node.js LTS, Python 3.11+, Git, and GitHub CLI. |
| **CPU Architecture** | Intel(R) Core(TM) i5-7200U @ 2.50GHz (2 Cores, 4 Logical Processors) | Dual-core CPU. Requires efficient, lightweight dev processes. |
| **Physical RAM** | **Total: 3.87 GB** \| **Available: ~0.35 GB** | ⚠️ **CRITICAL MEMORY CONSTRAINT:** System has 4GB total RAM. Heavy Docker daemons or multiple concurrent Node compilers will cause memory thrashing. Keep frontend and backend single-process and lightweight. Use SQLite for local development rather than running a heavy local PostgreSQL container. |
| **Disk Storage** | Drive C: **186.07 GB Free** / 237.84 GB Total | Plentiful disk space for dependencies, builds, and artifacts. |
| **Port Status** | Ports **3000** (Next.js), **8000** (FastAPI), **5432** (Postgres) are **ALL UNUSED** | Zero port collision risk. |

---

## 2. Runtimes & Tooling Inventory

| Tool | Status | Version / Path | Readiness Assessment |
|---|---|---|---|
| **Git** | ✅ **VERIFIED** | v2.47.1 (`$LOCALAPPDATA\Programs\Git\cmd\git.exe`) | Active in User PATH. Clean git status. |
| **GitHub CLI (`gh`)** | ✅ **VERIFIED** | v2.62.0 (`$LOCALAPPDATA\Programs\gh\gh.exe`) | Authenticated as `jashveer-sharma`. Remote connected. |
| **Remote Repository** | ✅ **VERIFIED** | `https://github.com/jashveer-sharma/eterpay.git` | Both `develop` and `main` branches synced. |
| **Node.js & npm** | ⚠️ **BLOCKED** | Not installed in host PATH | **Action Required:** Install Node.js LTS (v20+). |
| **Python & pip** | ⚠️ **BLOCKED** | Windows Store stub present; Python 3.11+ needed | **Action Required:** Install Python 3.11. |
| **Docker Engine** | ⚪ **NOT REQUIRED** | Not installed | Docker is omitted to conserve the 4GB RAM budget. Use native Uvicorn + Next.js. |
| **Database** | ✅ **PRE-CONFIGURED** | Local SQLite (`eterpay.db`) / Cloud PostgreSQL on Render | Zero RAM overhead locally. Fully ACID-compliant. |

---

## 3. Mandatory User Installation Actions (PowerShell)

To enable package installation and running the dev servers, open **PowerShell as Administrator** and run:

```powershell
# 1. Install Node.js LTS and Python 3.11 via Winget:
winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements

# 2. Restart PowerShell terminal and verify:
node -v
npm -v
python --version
```
*(Direct download fallbacks: [Node.js LTS Installer](https://nodejs.org/) | [Python 3.11 Installer](https://www.python.org/downloads/)).*

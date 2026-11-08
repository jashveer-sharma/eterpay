# EterPay — Cloudflare Infrastructure

This directory contains all Cloudflare infrastructure automation for EterPay.

## Account
- **Account ID**: `e233b39f3904bf6467d237c883cdd381`
- **Account Name**: EterPay Organization Account

## Architecture

EterPay uses a hybrid deployment:
- **Frontend**: Next.js on Cloudflare Pages (via `@cloudflare/next-on-pages`)
- **Backend API**: Python FastAPI on a VPS/Render (or Cloudflare Workers with Hono as an alternative)
- **Database**: SQLite locally / D1 on Cloudflare (optional migration path)
- **Security**: Cloudflare WAF + Rate Limiting on API routes

## Directory Structure

```
cloudflare/
├── README.md                    ← This file
├── wrangler.toml                ← Wrangler configuration
├── scripts/
│   ├── 01-verify-account.ps1   ← Verify CF API token & account
│   ├── 02-inspect-resources.ps1 ← Inspect existing workers/pages/D1
│   ├── 03-setup-pages.ps1      ← Create Cloudflare Pages project
│   ├── 04-setup-database.ps1   ← Create D1 database
│   ├── 05-configure-secrets.ps1 ← Push secrets via Wrangler
│   ├── 06-deploy.ps1           ← Deploy frontend to CF Pages
│   ├── 07-verify-deployment.ps1 ← Smoke-test public endpoints
│   └── 08-generate-report.ps1  ← Generate infrastructure report
├── migrations/
│   └── 0001_init.sql           ← D1 schema (mirror of SQLite)
├── environment/
│   ├── .env.cloudflare.example ← CF secrets template (never commit real values)
│   └── pages.env.example       ← Pages environment variable template
└── reports/                    ← Generated reports (gitignored)
```

## Quick Start

```powershell
# 1. Set your API token (never hardcode it)
$env:CF_API_TOKEN = "your_token_here"

# 2. Verify access
.\scripts\01-verify-account.ps1

# 3. Inspect existing resources
.\scripts\02-inspect-resources.ps1

# 4. Set up infrastructure (requires approval)
.\scripts\03-setup-pages.ps1
.\scripts\04-setup-database.ps1

# 5. Deploy (requires approval)
.\scripts\06-deploy.ps1
```

## Security Rules

- NEVER commit `CF_API_TOKEN` to git
- NEVER use the Global API Key — always use scoped tokens
- NEVER expose Cloudflare secrets in frontend code
- All secrets go through `wrangler secret put` or Pages environment variables
- Use `environment/.env.cloudflare.example` as a template only

## Deployment Strategy

### Option A: Cloudflare Pages (Recommended for hackathon)
- Next.js frontend deployed via `@cloudflare/next-on-pages`
- Backend stays on Render.com (existing `render.yaml` already configured)
- API proxied through Next.js rewrites

### Option B: Full Cloudflare Stack (Future)
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers (Hono + D1)
- Database: Cloudflare D1
- Storage: Cloudflare R2

## Notes for Judges

This infrastructure is managed programmatically via Cloudflare REST API and Wrangler CLI.
No manual dashboard operations are required after initial token setup.

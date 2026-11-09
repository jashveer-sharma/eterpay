# Deployment Guide — EterPay

> **Target:** Render.com (free tier) for production release  
> **Repo:** `https://github.com/jashveer-sharma/eterpay`

---

## 1. Architecture on Render

| Service | Type | Plan | Region |
|---|---|---|---|
| `eterpay-backend` | Web Service (Python) | Free | Oregon |
| `eterpay-frontend` | Web Service (Node) | Free | Oregon |

---

## 2. Pre-Deployment Checklist

Before deploying, verify locally:

```powershell
# Backend tests: all 10 must pass
cd c:\Users\Admin\Desktop\unipay\backend
.\.venv\Scripts\pytest.exe tests/test_api.py -v

# Frontend build: 0 errors
cd c:\Users\Admin\Desktop\unipay\frontend
npm run build
```

---

## 3. Environment Variables

### Backend (set in Render dashboard — NEVER commit these)

| Variable | Value |
|---|---|
| `PAYPAL_ENVIRONMENT` | `sandbox` |
| `PAYPAL_CLIENT_ID` | From developer.paypal.com |
| `PAYPAL_CLIENT_SECRET` | From developer.paypal.com |
| `PAYPAL_WEBHOOK_ID` | From PayPal developer dashboard |
| `GEMINI_API_KEY` | From aistudio.google.com |
| `GROQ_API_KEY` | From console.groq.com (optional) |
| `MAX_SINGLE_ORDER_INR` | `25000.00` |
| `MAX_SINGLE_ORDER_USD` | `300.00` |

### Frontend (set in Render dashboard)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Same sandbox Client ID |
| `NEXT_PUBLIC_API_URL` | URL of deployed backend (e.g. `https://eterpay-backend.onrender.com`) |

---

## 4. Deploy via render.yaml Blueprint

The `render.yaml` at repo root defines both services with IaC.

**Steps:**
1. Go to [render.com/dashboard](https://render.com/dashboard) → **New** → **Blueprint**
2. Connect your GitHub account
3. Select `jashveer-sharma/eterpay` repository
4. Render detects `render.yaml` automatically
5. Click **Apply** — both services are provisioned

> **Important:** After provisioning, add all secret env vars in each service's **Environment** tab on the Render dashboard. Do NOT put secrets in `render.yaml`.

---

## 5. Frontend API URL Configuration

After both services are live, update the frontend's backend URL:

In Render dashboard → `eterpay-frontend` → Environment:
```
NEXT_PUBLIC_API_URL=https://eterpay-backend.onrender.com
```

Then also update `frontend/next.config.js` for the production rewrite — or use the env var directly in fetch calls for Render deployment.

---

## 6. render.yaml Reference

```yaml
services:
  - type: web
    name: eterpay-backend
    env: python
    region: oregon
    plan: free
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PAYPAL_ENVIRONMENT
        value: sandbox
      - key: PAYPAL_CLIENT_ID
        sync: false
      - key: PAYPAL_CLIENT_SECRET
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: GROQ_API_KEY
        sync: false

  - type: web
    name: eterpay-frontend
    env: node
    region: oregon
    plan: free
    rootDir: frontend
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NEXT_PUBLIC_PAYPAL_CLIENT_ID
        sync: false
```

---

## 7. Post-Deploy Verification

```bash
# Backend health
curl https://eterpay-backend.onrender.com/health

# ECB rates
curl https://eterpay-backend.onrender.com/api/currency/rates?base=INR

# Frontend renders
open https://eterpay-frontend.onrender.com
```

Expected backend health response:
```json
{
  "status": "healthy",
  "project": "EterPay",
  "paypal_environment": "sandbox",
  "currency_provider": "Frankfurter (European Central Bank)"
}
```

---

## 8. Free Tier Limitations

| Limitation | Impact |
|---|---|
| Render free services **spin down** after 15 min inactivity | First request after idle is slow (~30s cold start) |
| Free tier **build time**: 400 min/month | Should be more than enough for platform deployment |
| Frankfurter ECB API | No rate limit for platform deployment usage |
| Gemini 1.5 Flash | 15 RPM / 1M tokens/day free tier |
| Groq Llama 3.3 70B | 30 RPM / 100K tokens/day free tier |

**Mitigation for cold starts:** Add a UptimeRobot free ping (every 10 min) to `https://eterpay-backend.onrender.com/health` to keep the backend warm during the demo window.

---

## 9. Git Tags for Deployment

```powershell
cd c:\Users\Admin\Desktop\unipay
git tag v0.3.0 -m "Full-stack MVP: Hallmark Dusk + PayPal sandbox + AG Grid + AI copilot"
git push origin v0.3.0
```

---

## 10. production release Checklist

- [ ] Repository is public at `https://github.com/jashveer-sharma/eterpay`
- [ ] `README.md` has setup instructions and screenshots
- [ ] No secrets in git history (`git log --all --diff-filter=A -- .env`)
- [ ] Latest stable code is on `main`
- [ ] GitHub Actions CI passes on `main`
- [ ] Demo video recorded (see `docs/DEMO_SCRIPT.md`)
- [ ] Render deployment URL is live
- [ ] PayPal sandbox modal tested end-to-end with real credentials
- [ ] Devpost submission drafted with prize categories identified

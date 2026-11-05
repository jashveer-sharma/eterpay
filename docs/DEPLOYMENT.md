# Deployment Guide — EterPay

## 1. Hosting Target: Render Cloud Platform
* **Frontend:** Static Site or Web Service (Next.js Node runtime)
* **Backend:** Web Service (Python 3.11 FastAPI)
* **Database:** Managed PostgreSQL Free Tier

## 2. Infrastructure as Code: `render.yaml`
```yaml
services:
  - type: web
    name: eterpay-backend
    env: python
    region: oregon
    plan: free
    buildCommand: pip install -r backend/requirements.txt
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
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm run start
    envVars:
      - key: NEXT_PUBLIC_BACKEND_URL
        fromService:
          type: web
          name: eterpay-backend
          property: host
```

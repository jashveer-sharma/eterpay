# EterPay — Frontend Route Map

The complete site architecture is organized into three decoupled route groups in the Next.js 15 App Router:

## 1. Public Marketing Group: `src/app/(public)`
- `/`: Master Homepage (Hero with 3D Orbit, Value Prop, Anywhere Preview, AI Demo, FAQ)
- `/about`: Origin story, architectural philosophy, values, mission, team
- `/personal`: Consumer personal banking, P2P transfers, foreign balances, copilot
- `/business`: Merchant suite, invoicing, recurring billing, tiered pricing
- `/products`: Comprehensive index of all 8 core platform modules
- `/anywhere`: Global Universal Payment & Interoperability System public showcase
- `/security`: Bank-grade encryption, PCI-DSS alignment, zero-secrets architecture
- `/help`: Knowledgebase, search engine, topical FAQs, support channels
- `/contact`: Interactive inquiry dispatch with confirmation telemetry
- `/developer`: Python & TypeScript integration guides, PayPal Orders v2, ECB FX
- `/privacy`: GDPR, telemetry safeguards, AI context sanitization
- `/terms`: Educational demonstration terms and risk disclaimers

## 2. Authentication Group: `src/app/(auth)`
- `/login`: Secure demo login with pre-populated credentials
- `/signup`: Multi-tab Personal and Business registration flow
- `/forgot-password`: Password recovery with simulated OTP generation
- `/onboarding`: 4-step wizard setting up account, wallet, and funding rails

## 3. Application Group: `src/app/(app)`
- `/dashboard`: Executive dashboard with balances, quick actions, portfolio, AI
- `/pay`: Send and transfer funds with idempotent UUID v4 verification
- `/wallet`: Multi-currency digital treasury (INR, USD, EUR, GBP, JPY, SGD)
- `/anywhere-hub`: Universal cross-border routing terminal across 200+ territories
- `/merchant`: Business and enterprise commercial dashboard
- `/global`: Global currency pairs, benchmark quotes, and international ledger
- `/currency`: Real-time ECB instant currency swap terminal
- `/transactions`: Audit ledger with full-text search, filtering, and export
- `/requests`: Inbound liquidity requests with sharable demo links
- `/links`: Instant no-code payment link generator
- `/qr`: Contactless payments: QR code generation and merchant scanning viewfinder
- `/invoices`: Line-item tax invoice builder and PDF generation simulator
- `/subscriptions`: Recurring membership tracker with pause/resume controls
- `/refunds`: Buyer protection claims and dispute mediation status
- `/invest`: Simulated multi-asset portfolio with mandatory safety badges
- `/commerce`: Embedded catalog, shopping cart drawer, and fast checkout
- `/travel`: Flight and luxury hotel reservations with currency locking
- `/ai`: Conversational copilot powered by Gemini 1.5 Flash backend
- `/analytics`: Cashflow run-rate bar chart and category breakdown
- `/notifications`: Security alerts and transaction notifications with mark-all-read
- `/profile`: User legal identity, KYC badges, and member credentials
- `/settings`: Security toggles, 2FA enforcement, and connected API gateways

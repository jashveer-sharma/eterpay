# EterPay — Master Implementation Plan & Design Architecture

> **Aesthetic Foundation:** Mercury × Brex Synthesis ("Alpine Observatory Meets Clinical Financial Workbench")  
> **Core Identity:** EterPay — Your Money. Everywhere. Intelligently Connected.  
> **Target:** PayPal "Build What's Next with PayPal and AI" Global platform deployment 2026

---

## 1. Design System Integration: Mercury × Brex Synthesis

The frontend architecture unites **Mercury's** hushed alpine banking atmosphere with **Brex's** precision financial workbench:

| Design Dimension | Mercury Attribute | Brex Attribute | EterPay Synthesis |
|---|---|---|---|
| **Base Canvas** | `#171721` Onyx Canvas | `#000710` Abyss Framing | `#171721` Onyx Canvas with Carbon `#15191e` navigation chrome |
| **Card Surfaces** | `#1e1e2a` Graphite Cards | 12px radius, hairline borders | `#1e1e2a` Graphite Cards, 12px radius, 1px hairline border |
| **Primary Accent** | `#5266eb` Cobalt (Sole chromatic CTA) | `#ff5900` Ember (High-intensity spark) | **Dual Chromatic Precision:** Cobalt for primary action/nav, Ember for payment gate/alerts |
| **Typography** | Intermediate weights (400, 480) | Negative tracking (`-0.01em` to `-0.03em`) | Inter with negative tracking, tabular numbers, and `"cv01", "cv10", "ss03", "zero"` features |
| **Interactive Controls**| 32px–40px Pill buttons & inputs | 12px form input radii | Full-pill buttons (`999px`) & tabs; 12px cards & modal dialogs |
| **Elevation** | Borderless value lift (no shadows) | Flat surfaces, Fog/Paper contrast | 100% shadow-free value contrast between Onyx canvas and Graphite cards |

---

## 2. Multi-Module Financial Ecosystem Map

EterPay expands from a single-screen prototype into a unified 12-module financial suite:

```
┌────────────────────────────────────────────────────────────────────────┐
│               Top Navigation Bar (Mercury Frosted Glass)               │
│  [EterPay Concentric Mark]  [Overview] [Pay] [Wallet] [Business]      │
│  [Invoices] [Global FX] [AG Grid Ledger] [Commerce] [Invest]           │
│  [Persona Switch: Personal ⇄ Business]       [Cobalt: "Quick Pay"]    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
┌───▼───────────────────────────┐       ┌───────────────────────────▼───┐
│ Left: AI Financial Copilot    │       │ Right: Dynamic Workbench      │
│ • Mercury Graphite Card       │       │ • Personal Mode (Travel, FX,  │
│ • Multi-Tier Model Dispatch   │       │   Portfolio, Commerce)        │
│ • Deterministic Payment Gate  │       │ • Business Mode (Invoices,    │
│   (Brex Ember Spark)          │       │   Merchant Sales, Subscriptions)│
│ • Quick Prompts & Context     │       │ • AG Grid Precision Terminal  │
└───────────────────────────────┘       └───────────────────────────────┘
```

---

## 3. Phased Sprint Roadmap (Nov 5 – Nov 12, 2026)

### Phase 1: Foundation & Architecture (Completed ✅)
* [x] Environment audit, Python 3.11 (`uv`), Node.js v26 runtime setup.
* [x] GitHub repository `jashveer-sharma/eterpay` created with `main` and `develop` branches.
* [x] Full 12-document architecture & feasibility suite in `docs/`.
* [x] Mercury × Brex Design System specification (`docs/DESIGN_SYSTEM_MERCURY_BREX.md`).

### Phase 2: Core Platform Engine (Completed ✅)
* [x] Server-side PayPal Orders v2 integration (`create-order`, `capture-order`, `webhook`).
* [x] UUIDv4 Idempotency enforcement & ₹25,000 INR spend limit safety engine.
* [x] European Central Bank exchange rates client via Frankfurter API with 1-hour cache.
* [x] Multi-tier AI Orchestrator (Gemini 1.5 Flash + Groq 70B fallback + Deterministic engine).
* [x] AG Grid Community v32 transaction ledger with AI-driven dynamic filter hook.
* [x] Automated test suite: 10/10 tests passing.

### Phase 3: UI Redesign to Mercury × Brex Standards (Current Sprint)
* [ ] Update `globals.css` with master Mercury Onyx/Graphite & Brex Cobalt/Ember tokens.
* [ ] Update `tailwind.config.ts` with named theme tokens.
* [ ] Transform `page.tsx` into a multi-module cockpit:
  * Top navigation bar with live rates ticker, persona switcher (`Personal` vs `Business`), and quick actions.
  * Left panel: AI Financial Copilot in Graphite Card styling with Brex Ember Deterministic Payment Gate.
  * Right panel: Multi-module tab views (Overview, Pay & Transfer, Invoices, Currency & Rates, AG Grid Ledger, Agentic Commerce, Portfolio & Risk).
* [ ] Verify Hallmark sloplint: 0 FAIL.
* [ ] Verify clean Next.js production build.

### Phase 4: Deployment & Submission (Nov 10 – Nov 12)
* [ ] Connect repository to Render.com Blueprint using `render.yaml`.
* [ ] Record 2m45s video walkthrough following `docs/DEMO_SCRIPT.md`.
* [ ] Devpost submission for Main Prize, AG Grid ($5K), Agentic Commerce ($5K), and Channel3 ($1.5K).

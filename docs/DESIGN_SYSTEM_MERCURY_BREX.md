# EterPay Design System — Mercury × Brex Synthesis
> **Alpine Observatory Meets Clinical Financial Workbench**  
> *A precision cross-border financial instrument where hushed onyx surfaces meet high-intent Cobalt and Ember sparks.*

---

## 1. Aesthetic Thesis & Architectural Union

EterPay synthesizes the finest attributes of two world-class fintech interfaces:

* **From Mercury ("Alpine banking at blue hour"):**
  * Near-black **Onyx Canvas** (`#171721`) establishing a quiet, observatory-like atmosphere.
  * **Graphite Cards** (`#1e1e2a`) elevated by value contrast alone — zero heavy drop shadows.
  * **Vivid Cobalt** (`#5266eb`) as the gravitational center for primary actions and account verification.
  * **Pill-shaped interactive controls** (32px–40px radius) for buttons, inputs, and navigation links.
  * Generous spacing rhythm and calm, desaturated surfaces.

* **From Brex ("White concrete, single ember — precision workbench"):**
  * **Engineered Inter Typography** with negative letter spacing (`-0.01em` to `-0.03em`) and font features (`"zero", "cv01", "cv10", "ss03"`).
  * **Intense Ember** (`#ff5900`) for volatility alerts, payment gates, and live conversion triggers.
  * Hard framing and hairline structural borders (`#2a2b38` / `rgba(255, 255, 255, 0.08)`).
  * High-density financial data presentation optimized for AG Grid Community v32 tables.

---

## 2. Master Palette & CSS Custom Properties

```css
:root {
  /* Canvas & Base Surfaces (Mercury Onyx & Abyss) */
  --color-onyx:         #171721; /* Base page canvas, deep background */
  --color-graphite:     #1e1e2a; /* Elevated card surface — 1 step lighter */
  --color-obsidian:     #272735; /* Secondary button fills, form attachments */
  --color-abyss:        #000710; /* Deepest footer and framed borders */
  --color-carbon:       #15191e; /* Announcement bar and navigation chrome */

  /* Structural Hairlines (Brex Mist & Slate) */
  --color-hairline:     rgba(255, 255, 255, 0.08); /* 1px hairline border */
  --color-hairline-hi:  rgba(255, 255, 255, 0.16); /* Highlight border on hover/active */
  --color-slate:        #70707d; /* Structural dividers */

  /* Typography (Mercury Ivory & Ash + Brex Graphite) */
  --color-ivory:        #ededf3; /* Primary foreground text, headings, icons */
  --color-ash:          #c3c3cc; /* Secondary text, descriptions, table body */
  --color-muted:        #7f8c9d; /* Muted helper labels, time stamps, captions */

  /* Chromatic Signatures (Mercury Cobalt + Brex Ember) */
  --color-cobalt:       #5266eb; /* Primary action, selected tabs, approval buttons */
  --color-cobalt-hover: #4355d6; /* Hover state for primary actions */
  --color-cobalt-soft:  rgba(82, 102, 235, 0.12); /* Selected pill backgrounds */
  --color-ember:        #ff5900; /* Payment gate spark, live rate alerts, volatility */
  --color-ember-soft:   rgba(255, 89, 0, 0.12); /* Alert pill backgrounds */
  --color-success:      #00e676; /* Verified capture indicator, ledger badges */
  --color-success-soft: rgba(0, 230, 118, 0.12);

  /* Geometry & Radii */
  --radius-card:        12px;   /* Standard card container */
  --radius-pill:        999px;  /* Buttons, inputs, navigation tags */
  --radius-sm:          6px;    /* Chips, badges, small table tags */

  /* Typography Scale (Inter with negative tracking) */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

---

## 3. Typography Rules

* **Body & UI Font:** `Inter` with OpenType features (`"cv01", "cv10", "ss03", "zero"`).
* **Headings:**
  * Display Headline: `32px` to `48px`, weight `500` to `600`, letter-spacing `-0.025em`, line-height `1.15`.
  * Section Title: `20px` to `24px`, weight `500`, letter-spacing `-0.015em`, line-height `1.25`.
  * Card Label / Meta: `12px` to `14px`, weight `400` to `500`, letter-spacing `0.005em`, color `--color-ash`.
* **Numbers & Ledgers:** Monospace tabular numbers (`font-variant-numeric: tabular-nums`).

---

## 4. Component Standards

### 1. Primary Action Button (Mercury Cobalt Pill)
* Background: `#5266eb` (Cobalt)
* Text: `#ffffff` at 14px weight 500, letter-spacing `-0.01em`
* Radius: `999px` (full pill)
* Padding: `8px 20px` (inline) or `12px 24px` (prominent)
* Elevation: No drop shadow; pure value contrast against Onyx/Graphite.

### 2. High-Intent Payment Gate (Brex Ember Spark)
* Border: `1px solid rgba(255, 89, 0, 0.35)`
* Background: `#1e1e2a` (Graphite) with a subtle Ember gradient edge
* Action: Prominent PayPal checkout modal with Ember badge: `[Deterministic Payment Gate]`.

### 3. Graphite Content Card
* Background: `#1e1e2a`
* Border: `1px solid rgba(255, 255, 255, 0.08)`
* Radius: `12px`
* Padding: `24px` to `32px`
* Elevation: Borderless value lift from `#171721` canvas.

### 4. Top Frosted Navigation Bar
* Background: `rgba(23, 23, 33, 0.85)` with `backdrop-filter: blur(16px)`
* Radius: Full width with subtle bottom hairline divider
* Left: EterPay wordmark with concentric-ring emblem
* Center: Navigation pill links (Overview, Pay & Transfer, Invoices, Currency, AG Grid Ledger, Commerce, Invest)
* Right: Persona Switcher (`Personal` vs `Business`) and Cobalt primary CTA.

### 5. AG Grid Precision Ledger
* Header: `#15191e` (Carbon) with uppercase, untracked 11px Ivory headers
* Rows: `#1e1e2a` (Graphite) with hairline borders `#2a2b38`
* In-cell sparklines: SVG stroke in Cobalt `#5266eb` (positive) or Ember `#ff5900` (negative)
* Status Badges: Pill-shaped badges (10px) with soft tint fills.

---

## 5. Strict Do's and Don'ts

### Do
* Keep canvas strictly Onyx (`#171721`) and cards Graphite (`#1e1e2a`).
* Reserve Cobalt (`#5266eb`) for primary confirmation CTAs and selected navigation states.
* Reserve Ember (`#ff5900`) for the Deterministic Payment Gate, rate volatility alerts, and security warnings.
* Apply negative tracking (`-0.01em` to `-0.025em`) on Inter headings for the engineered feel.
* Use full pill borders (`999px`) on buttons and interactive chips, and `12px` on cards.

### Don't
* Never use multiple competing saturated colors on the same card.
* Never add heavy blurry drop shadows — rely on Graphite-on-Onyx contrast.
* Never use pure white (`#ffffff`) for body paragraphs — use Ivory (`#ededf3`) or Ash (`#c3c3cc`).
* Never use sharp 0–4px corners on interactive buttons or chips.

# Design System & UI Specification (Phase 11)

> **Document Status:** Active Frontend Design System  
> **Visual Identity:** Neon-Dark Obsidian Fintech Terminal

---

## 1. Color Palette Tokens

```css
:root {
  /* Surfaces */
  --bg-primary: #090A0F;        /* Deep obsidian black */
  --bg-secondary: #0D0F17;      /* Panel container background */
  --bg-card: #10121A;           /* Card & widget surface */
  --border-subtle: #181C28;     /* Inactive borders */
  --border-focus: #202638;      /* Input focus & hover borders */

  /* Neon Accents */
  --neon-green: #00E676;        /* Primary action, approval, positive P&L */
  --neon-green-glow: rgba(0, 230, 118, 0.2);
  --electric-cyan: #00B0FF;     /* Secondary currency swaps & information */
  --warning-amber: #FFD600;     /* Simulation badges & warnings */
  --danger-crimson: #FF1744;    /* Negative P&L & failed transactions */

  /* Typography */
  --text-primary: #FFFFFF;      /* High-contrast headings & primary values */
  --text-secondary: #8B949E;    /* Table headers, timestamps, labels */
  --text-muted: #555E6D;        /* Disclaimers & metadata */
}
```

---

## 2. Typography & Font Hierarchy
* **Primary Sans:** Inter / System Sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) for UI controls and chat bubbles.
* **Monospace Data:** Geist Mono / JetBrains Mono for exchange rates, currency tickers, Order IDs, and AG Grid cells.

---

## 3. Core Component States

### A. Action Proposal Card (Payment Gate)
* **Background:** `#101915` with `#00E676`/40 border.
* **Header:** High-contrast pill badge with shield icon: `[🛡️ DETERMINISTIC PAYMENT GATE]`.
* **Button:** Full-width neon green button with subtle glow (`shadow-lg shadow-[#00E676]/20`).

### B. AG Grid Dark Neon Theme (`ag-theme-quartz-dark`)
* **Grid Background:** `#0D0F17`
* **Header Background:** `#121520` with `#8B949E` uppercase labels.
* **Row Hover:** `#161A29` with smooth 150ms transition.
* **Sparklines:** In-cell SVG paths with `#00E676` stroke for upward momentum and `#FF1744` for downward trends.

### C. Simulation Warning Pill
* **Style:** Yellow badge `#FFD600`/10 background with `#FFD600`/30 border:
  `[🟡 Simulated Portfolio — Educational Only — No Capital at Risk]`

---

## 4. Responsive Breakpoints
* **Desktop (≥ 1024px):** 12-column grid. Left 5 columns dedicated to the Conversational Copilot and Action Cards; right 7 columns dedicated to the Multi-Currency AG Grid Terminal, Channel3 Carousel, and Stress Simulator.
* **Mobile (< 1024px):** Single-column stacked cockpit with sticky bottom input bar.

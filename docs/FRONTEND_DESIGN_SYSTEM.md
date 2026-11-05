# EterPay — Frontend Design System Specification

## 1. Core Architecture
- **Framework:** Next.js 15 (App Router with Parallel Route Groups)
- **Styling Engine:** Tailwind CSS v3.4 + Custom CSS Token Custom Properties
- **Icons:** Lucide React v0.460
- **Typography:** Typekit Adobe Font Embed (`ivypresto-headline`, `neue-haas-unica`) + Google Fonts Fallback (`Playfair Display`, `Plus Jakarta Sans`)

---

## 2. Component System
### Buttons (`.btn`)
- `.btn-primary`: Pill shape, `#0f4d40` background, `#fbf9f5` text, active scale `0.97`.
- `.btn-secondary`: Pill shape, transparent background, `1.5px` border `#111111/18`.
- `.btn-dark`: Pill shape, `#111111` background, `#fbf9f5` text.
- `.btn-ghost`: Pill shape, zero border, subtle hover highlight.

### Cards (`.card`)
- `.card`: White background `#ffffff`, `1px` border `rgba(17,17,17,0.08)`, radius `1rem` (`rounded-2xl`).
- `.card-cream`: `#f4f0e8` surface, radius `1rem`.
- `.card-dark`: `#111111` canvas with `#1e1e1e` card elevate, radius `1.5rem` (`rounded-3xl`).

### Financial Tables
- AG-Grid & Tailwind tabular tables featuring fixed header heights (`36px`), currency right-alignment, and status pills.

### Badges (`.badge`)
- `.badge-success`: `#f0fdf4` fill with `#16a34a` text.
- `.badge-warning`: `#fffbeb` fill with `#d97706` text.
- `.badge-error`: `#fef2f2` fill with `#dc2626` text.
- `.demo-badge`: Amber outline pill for regulatory sandbox clarity.

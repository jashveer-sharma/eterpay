# Miligram — Visual Reference Audit & Adaptation Guide

> Reference Source: https://miligram.pt/  
> Role: Visual Authority for EterPay Design System

---

## 1. Visual Philosophy: Editorial Clarity & Tactile Warmth
Miligram departs from traditional neon-glow fintech templates by establishing an organic, gallery-grade atmosphere:
- **Warm Cream Canvas (`#fbf9f5`):** A soft, eye-resting alabaster background replaces stark sterile whites or generic pitch-blacks.
- **Deep Monochromatic Ink (`#111111`):** High-contrast typography with deliberate letterforms.
- **Deep Forest Green Accent (`#0f4d40`):** An organic, wealthy botanical green acting as the singular chromatic anchor for primary actions, focus rings, and signature surfaces.
- **Editorial Typography Pairing:** Typekit display serif (`ivypresto-headline`, fallback `Playfair Display`) paired with a neutral, geometric sans (`neue-haas-unica`, fallback `Plus Jakarta Sans`).
- **Tactile Border Structures:** Subtle semi-transparent ink boundaries (`rgba(17,17,17,0.08)`) with generous card rounding (`rounded-2xl` and `rounded-3xl`).

---

## 2. Design Token Translation Matrix

| Dimension | Miligram Source Value | EterPay Adapted Token | Tailwind / CSS Utility |
|---|---|---|---|
| **Base Canvas** | `#fbf9f5` | `--cream: #fbf9f5` | `bg-[#fbf9f5]` |
| **Secondary Surface** | `#f4f0e8` | `--cream-alt: #f4f0e8` | `bg-[#f4f0e8]` |
| **Primary Text** | `#111111` | `--ink: #111111` | `text-[#111111]` |
| **Secondary Text** | `#555555` / `#666666` | `--ink-muted: #555555` | `text-[#555555]` |
| **Primary Accent** | `#0f4d40` | `--forest: #0f4d40` | `bg-[#0f4d40]`, `text-[#0f4d40]` |
| **Accent Hover** | `#0a352c` | `--forest-dark: #0a352c` | `hover:bg-[#0a352c]` |
| **Dark Section Canvas** | `#111111` | `--charcoal: #181818` | `bg-[#111111]` |
| **Light Text on Dark** | `#fbf9f5` | `--cream: #fbf9f5` | `text-[#fbf9f5]` |
| **Borders (Light)** | `rgba(17,17,17,0.08)` | `--border: rgba(17,17,17,0.08)` | `border-[rgba(17,17,17,0.08)]` |
| **Borders (Dark)** | `rgba(255,255,255,0.1)` | `--border-dark` | `border-[rgba(255,255,255,0.1)]` |
| **Corner Radius** | `16px` / `24px` | `1rem` / `1.5rem` | `rounded-2xl` / `rounded-3xl` |
| **Primary Buttons** | Pill Shape | Rounded Full Pill | `rounded-full` |

---

## 3. Kinetic & 3D Storytelling Adaptation
- **Interactive Orbiting Rings:** Replacing flat stock vectors with dynamic CSS & WebGL concentric orbits representing international clearing paths.
- **Tabular Figures for Finance:** Financial balances utilize `font-variant-numeric: tabular-nums` to guarantee vertical column alignment without layout jitter.
- **Deliberate Anti-Slop:** Eliminating pulsing rings, random purple gradients, glossy emojis, and arbitrary spacing.

# Hackathon Strategy & Evaluation Blueprint (Phase 14)

> **Target Event:** PayPal Build What's Next with PayPal and AI Hackathon 2026  
> **Evaluation Window:** Closes November 12, 2026, 12:00 PM PST  
> **Total Available Prize Pool:** $67,500+ in Cash + Sponsor Awards

---

## 1. Judging Criteria & EterPay Scoring Alignment

| Judging Category | What PayPal Judges Look For | How EterPay Excels |
|---|---|---|
| **Technical Implementation** | Non-trivial use of PayPal APIs and AI models; working prototype with clean code and no mock shortcuts. | • Real server-side **PayPal Orders v2 API** with idempotency & webhook verification.<br>• Real multi-tier AI tool calling (Gemini + Groq).<br>• High-performance **AG Grid** with custom renderers and live sparklines. |
| **Innovation & Idea** | Creative, novel blending of AI agents with payments; distinct from ordinary banking apps. | • **Agentic Commerce Pipeline:** Conversational intent directly triggers Channel3 product search and constructs real PayPal order proposals.<br>• Dynamic AI manipulation of AG Grid filter state. |
| **Potential Impact** | Real-world problem solving for a real audience. | • Direct utility for 30M+ annual outbound travelers and cross-border freelancers.<br>• Exposes and eliminates hidden 3.5%-5.0% bank/card DCC conversion spreads. |
| **Design / UX** | Coherent, polished, and intuitive product experience. | • Neon-dark obsidian terminal theme (`#090A0F`, `#00E676`).<br>• High-contrast deterministic safety approval card. |
| **Presentation** | High-clarity 3-minute video communicating problem, solution, and live working demo. | • Fast-paced 2m45s walkthrough following one traveler persona (Tokyo trip). |

---

## 2. Prize Stacking Strategy

A single coherent demo targets up to **$17,500+ in cash prizes** simultaneously:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIZE STACKING MATRIX                           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. MAIN PLACEMENT: 1st ($12,000) / 2nd ($8,000) / 3rd ($5,000)         │
│                                                                        │
│ 2. SPECIAL AWARDS:                                                     │
│    • Best Use of Agentic Commerce ($5,000)                             │
│    • Best Use of PayPal + AI ($5,000)                                  │
│                                                                        │
│ 3. SPONSOR AWARDS:                                                     │
│    • Best Use of AG Grid - 1st Place ($5,000)                          │
│    • Best Use of Channel3 ($1,500)                                     │
│    • Best Use of APIMatic ($1,000)                                     │
│    • Best Use of Render ($1,000 Credits)                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The 3-Minute Winning Demo Script

* **[0:00 - 0:25] The Problem:** *"Global travel and cross-border spending are plagued by hidden 4.5% bank conversion spreads, confusing ATM fees, and disconnected payment apps. Meet **EterPay** — an intelligent financial cockpit combining conversational AI, real-time currency intelligence, AG Grid, and PayPal."*
* **[0:25 - 0:55] AI Copilot & Live Rates:** *"Watch our user plan a 7-day trip to Tokyo with ₹1,50,000. EterPay's AI calculates the live ECB conversion (1 INR = 1.82 JPY), creates an itemized budget, and flags costly ATM DCC markups."*
* **[0:55 - 1:30] AG Grid Financial Terminal:** *"All multi-currency balances stream into AG Grid with live 7-day sparklines. Notice when we prompt the assistant to 'filter my travel expenses', the AI dynamically modifies the AG Grid filter model in real time."*
* **[1:30 - 2:05] Agentic Commerce (Channel3):** *"Our traveler needs a Japanese Type A plug adapter. The AI queries Channel3 across 25,000 retailers, returns verified products under our budget, and lets us select an Anker adapter with one click."*
* **[2:05 - 2:40] Deterministic Safe PayPal Checkout:** *"EterPay creates a structured order proposal. We review the converted price and click 'Approve with PayPal'. The real PayPal Sandbox modal opens, we authorize, and the Orders API captures the payment. Our webhook verifies completion and updates the ledger."*
* **[2:40 - 3:00] Conclusion:** *"EterPay: Your Money. Everywhere. Intelligently Connected. Built for the PayPal AI Hackathon 2026."*

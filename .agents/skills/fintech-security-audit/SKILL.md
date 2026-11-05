---
name: fintech-security-audit
description: >-
  Security guidelines, PCI-DSS boundaries, secret handling, anti-injection filters,
  and transaction integrity verification for EterPay.
---

# Fintech Security & Audit Skill

Use this skill to audit all incoming code, payment flows, and API interactions for security vulnerabilities.

## 1. Credentials & Secrets
* No secrets in version control. `.env` is ignored via `.gitignore`.
* Client Secret never bundled in Next.js bundle (`NEXT_PUBLIC_` prefix forbidden for private keys).
* Environment variables strictly loaded via FastAPI Pydantic Settings.

## 2. Anti-Prompt Injection & Hallucination Prevention
* Sanitize all free-text input to the AI assistant. Strip system prompt override attempts.
* Pydantic schemas enforce type safety: amounts must be positive floats with max 2 decimal places.
* Maximum single order cap: Default limit enforced at backend level (e.g., ₹25,000 / $300) regardless of what the LLM proposes.

## 3. Financial Integrity & Idempotency
* Every order generation must pass an idempotency key (UUID v4) stored in memory or Redis with a 15-minute TTL.
* Double-submission protection: Disable submit button in UI upon first click; enforce database unique constraints on `paypal_order_id`.

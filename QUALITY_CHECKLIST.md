# Pre-Commit & Production Quality Checklist

Before any Git commit or release tag:

### 1. Security & Secrets (Zero Leakage)
- [ ] No `.env` files staged in Git (`git status` confirms untracked or ignored).
- [ ] No API keys, PayPal secrets, or database URLs hardcoded in source files.
- [ ] `.env.example` contains only placeholder strings.

### 2. Financial Safety
- [ ] Backend enforces single-order spend limits on all order creation calls.
- [ ] AI cannot capture payments directly (Human Approval Gate enforced).
- [ ] Every PayPal order sends a UUID v4 idempotency token.
- [ ] All investment portfolios display the non-capital-at-risk simulation disclaimer.

### 3. Build & Runtime
- [ ] TypeScript compiles cleanly with zero type errors (`npm run build`).
- [ ] Backend routes mount and pass health check (`GET /health` returns 200).
- [ ] Table ledgers render without hydration mismatches or console errors.

### 4. Release Deliverables
- [ ] Public GitHub repository accessible with MIT license.
- [ ] Hosted demo URL running cleanly.
- [ ] Documentation and architectural guides fully up to date.

# Pre-Commit & Submission Quality Checklist (Phase 12)

Before any Git commit or hackathon milestone merge:

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
- [ ] AG Grid renders without hydration mismatches or console errors.

### 4. Hackathon Submission Deliverables
- [ ] Public GitHub repository accessible with MIT license.
- [ ] Public hosted demo URL running on Render.
- [ ] YouTube demo video under 3 minutes showing end-to-end PayPal sandbox checkout.
- [ ] Postman collection included for judge API evaluation.

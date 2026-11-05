# Testing Strategy & Quality Assurance (Phase 12)

> **Document Status:** Comprehensive Testing Protocol  
> **Testing Scope:** Backend Unit/API Tests, PayPal Sandbox Life Cycle, AI Fallbacks, and AG Grid Rendering

---

## 1. Test Pyramid & Automation Framework

```
         / \
        / E2E \       Playwright / Manual 3-Minute Demo Journey
       /-------\
      / Backend \     Pytest + HTTPX TestClient for FastAPI Endpoints
     /   API     \    PayPal Sandbox Mock & Live Response Verification
    /-------------\
   /   Unit Tests  \  Currency client math, Pydantic validation, safety caps
  /-----------------\
```

---

## 2. Test Execution Commands (Local & CI)

### Backend Tests (Pytest)
```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Build Verification
```bash
cd frontend
npm run lint
npm run build
```

---

## 3. Strict Verification Invariants
1. **Never mock a test result:** Tests must run against actual code and return genuine exit codes.
2. **PayPal Sandbox isolation:** All tests use Sandbox endpoints (`api-m.sandbox.paypal.com`). Zero production credentials.
3. **Deterministic math verification:** Currency conversions and fee savings must match reference ECB calculations down to 2 decimal places.

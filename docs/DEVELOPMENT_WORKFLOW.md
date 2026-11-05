# Development Workflow & Release Protocol — EterPay

## 1. Feature Lifecycle
1. **Branch Out:** `git checkout develop && git pull && git checkout -b feature/<name>`
2. **Implement:** Write code adhering to `GEMINI.md` directives (targeted edits, zero client secrets).
3. **Verify:** Run automated unit tests (`pytest` for backend, `npm test` for frontend).
4. **Audit:** Scan `git status` and `git diff` for exposed credentials or accidental files.
5. **Commit:** Use conventional commit syntax: `feat: implement paypal capture webhook`.
6. **Merge to develop:** `git checkout develop && git merge feature/<name>`
7. **Milestone Release:** When an integrated milestone passes end-to-end checks, merge into `main` and tag: `git tag -a v0.1.0 -m "Release v0.1.0: PayPal Sandbox & AG Grid Core"`.

## 2. Emergency Rollback Protocol
If an unstable commit is introduced:
```bash
# Safely revert the specific bad commit without rewriting shared history
git revert <commit-hash>
git push origin develop
```
*Never execute `git reset --hard` or force-push on shared remote branches.*

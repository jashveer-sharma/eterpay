---
name: token-optimization
description: >-
  Rules, caching patterns, context management, and targeted code editing strategies
  to minimize AI token consumption during EterPay development.
---

# Token Optimization & Context Efficiency Skill

Use this skill to maintain minimal token overhead during development.

## 1. Context Minimization Principles
* **Progressive Disclosure:** Do not send whole architecture specs in prompts. Keep system prompts modular and task-specific.
* **Targeted Line Edits:** Use `edit_file` with exact match strings rather than overwriting entire components.
* **Bounded Reads:** Always pass `StartLine` and `EndLine` parameters to `read_file` to inspect only the relevant function or block.
* **Reusable Schema Singletons:** Export Pydantic schemas and TypeScript interfaces in `shared/` directories to prevent redefining contracts across multiple files.

## 2. Documentation-First Reference
Instead of asking the LLM to research APIs from scratch:
* Reference `docs/API_REFERENCE.md` for verified endpoints.
* Reference `docs/DATABASE_SCHEMA.md` for exact column types.
* Use APIMatic Context Plugin or Context7 to pull pinned official docs.

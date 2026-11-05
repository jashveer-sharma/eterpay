# Contributing to EterPay

Thank you for contributing to EterPay! This project is being actively developed for the **PayPal AI Hackathon 2026**.

## 1. Branching Strategy
* `main`: Protected production branch. Represents tested, stable milestone releases.
* `develop`: Integration branch where tested features meet.
* `feature/<feature-name>`: Scoped branches for individual features (e.g. `feature/paypal-orders-api`).
* `fix/<bug-name>`: Bugfix branches.

## 2. Commit Message Guidelines
We strictly enforce Conventional Commits:
* `feat:` A new feature (e.g. `feat: add AG Grid sparkline renderer`)
* `fix:` A bug fix (e.g. `fix: validate currency code before order creation`)
* `docs:` Documentation updates
* `refactor:` Code restructuring without functional changes
* `test:` Adding or updating tests

## 3. Mandatory Security Rules
* **NEVER commit `.env` or credentials.** Check `git status` before committing.
* Never hardcode API keys or secrets in test files.
* All financial transactions must enforce the **Deterministic Safety Gate** (Human Approval Required).

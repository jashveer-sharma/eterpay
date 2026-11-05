# Changelog — EterPay

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Sprint 1 (2026-11-05)
- Initialized workspace architecture and root configuration files.
- Added MIT License and `.gitignore` preventing secret leakage.
- Created Antigravity execution rules (`GEMINI.md`) and `.agents/mcp_config.json`.
- Implemented 5 native Antigravity custom skills:
  - `paypal-integration` (Orders v2, capture, webhooks)
  - `ag-grid-fintech` (Quartz dark theme, custom renderers, sparklines, AI filter hook)
  - `free-ai-orchestration` (Gemini 1.5 Flash + Groq Llama 3.3 70B fallback)
  - `token-optimization` (targeted surgical diffs, bounded reads)
  - `fintech-security-audit` (idempotency, single-order caps, PCI-DSS boundaries)
- Created 11 core architecture and tracking documents in `docs/`.
- Configured GitHub branching strategy and version control guidelines.

# GitHub Setup & Repository Guide — EterPay

> **Repository Name:** `eterpay`  
> **Intended Visibility:** Public (for PayPal AI Hackathon evaluation)  
> **Status:** Local Git Initialized · Remote Setup Pending Authentication

---

## 1. Branching Strategy

```
  main ─────────────────●───────────────● (v1.0.0 Stable Release)
                         ▲               ▲
  develop ───────●───────┴───────●───────┘ (Integration)
                 ▲               ▲
  feature/* ─────┴─●───●         └─●───● (Sprint Milestones)
```

| Branch | Purpose | Protection Rules |
|---|---|---|
| `main` | Production-ready submission code | Tested, verified builds only. No direct pushes. |
| `develop` | Active development and integration | Merged from feature branches after checks pass. |
| `feature/paypal-checkout` | PayPal Orders v2 & JS SDK integration | Rebased onto `develop`. |
| `feature/ag-grid-terminal`| AG Grid table & sparklines | Rebased onto `develop`. |
| `feature/ai-orchestrator` | Gemini & Groq tool calling | Rebased onto `develop`. |

---

## 2. GitHub CLI (`gh`) Authentication Guide

To authenticate with your GitHub account:

### Step 1: Open PowerShell
Run the following command:
```powershell
gh auth login
```

### Step 2: Select the Options
1. **What account do you want to log into?** -> `GitHub.com`
2. **What is your preferred protocol for Git operations?** -> `HTTPS`
3. **Authenticate Git with your GitHub credentials?** -> `Yes`
4. **How would you like to authenticate GitHub CLI?** -> `Login with a web browser`

### Step 3: Authorize
A one-time code will appear in your terminal. Press Enter to open your browser, enter the code, and approve access.

---

## 3. Remote Repository Creation Commands

Once authenticated, create the repository and push:

```powershell
# Create public GitHub repository
gh repo create eterpay --public --source=. --remote=origin --description "EterPay — Your Money. Everywhere. Intelligently Connected. Built for the PayPal AI Hackathon 2026."

# Push develop and main branches
git checkout -b develop
git push -u origin develop

git checkout -b main
git push -u origin main
```

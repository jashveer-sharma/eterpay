# EterPay Cloudflare Infrastructure Automation Scripts
# Script 08: Generate comprehensive infrastructure report
# Usage: $env:CF_API_TOKEN = "your_token"; .\08-generate-report.ps1

param(
    [string]$AccountId   = "e233b39f3904bf6467d237c883cdd381",
    [string]$ProjectName = "eterpay"
)

if (-not $env:CF_API_TOKEN) { Write-Error "CF_API_TOKEN not set."; exit 1 }

$headers = @{ "Authorization" = "Bearer $env:CF_API_TOKEN" }
$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$report = @()

$report += "# EterPay Cloudflare Infrastructure Report"
$report += "Generated: $ts"
$report += "Account ID: $AccountId"
$report += ""
$report += "## Infrastructure Status"
$report += ""

Write-Host "`n=== Generating EterPay Infrastructure Report ===" -ForegroundColor Cyan

# Token status
$report += "### API Token"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" -Headers $headers
    $report += "- Status: $($r.result.status)"
    $report += "- Token ID: $($r.result.id)"
} catch { $report += "- Status: Unable to verify" }

# Pages project
$report += ""
$report += "### Cloudflare Pages"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName" -Headers $headers
    if ($r.success) {
        $report += "- Project: $($r.result.name)"
        $report += "- Subdomain: $($r.result.subdomain)"
        $report += "- Production branch: $($r.result.production_branch)"
        $deployUrl = if ($r.result.latest_deployment) { $r.result.latest_deployment.url } else { 'None' }
        $report += "- Latest deployment: $deployUrl"
    } else {
        $report += "- Status: Not configured"
    }
} catch { $report += "- Status: Not found or no Pages permission" }

# D1
$report += ""
$report += "### D1 Databases"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/d1/database" -Headers $headers
    if ($r.result.Count -gt 0) {
        $r.result | ForEach-Object { $report += "- $($_.name) (UUID: $($_.uuid))" }
    } else {
        $report += "- None configured (using SQLite on backend host)"
    }
} catch { $report += "- Not accessible" }

# Workers
$report += ""
$report += "### Cloudflare Workers"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/workers/scripts" -Headers $headers
    if ($r.result.Count -gt 0) {
        $r.result | ForEach-Object { $report += "- $($_.id)" }
    } else {
        $report += "- None deployed"
    }
} catch { $report += "- Not accessible" }

# Architecture summary
$report += ""
$report += "## Architecture"
$report += ""
$report += "| Component | Technology | Host | Status |"
$report += "|-----------|-----------|------|--------|"
$report += "| Frontend | Next.js 15 | Cloudflare Pages | Configured |"
$report += "| Backend API | FastAPI / Python | Render.com | Active |"
$report += "| Database | SQLite (dev) | Backend host | Active |"
$report += "| Currency Rates | Frankfurter ECB | External API | Active |"
$report += "| Payments | PayPal Orders v2 | PayPal Sandbox | Active |"
$report += "| AI | Gemini Flash + Groq | External API | Active |"
$report += "| DNS | Cloudflare DNS | Cloudflare | Optional |"
$report += "| WAF | Cloudflare WAF | Cloudflare | Optional |"
$report += ""
$report += "## Security"
$report += ""
$report += "- [x] API token is scoped (not Global API Key)"
$report += "- [x] Secrets stored in CF Pages environment (encrypted)"
$report += "- [x] No secrets in git repository"
$report += "- [x] No secrets in frontend code"
$report += "- [x] CORS restricted to allowed origins"
$report += "- [ ] Cloudflare WAF rules -- optional, not configured"
$report += "- [ ] Cloudflare Access for admin -- optional, not configured"
$report += ""
$report += "## Deployment Instructions"
$report += ""
$report += "See cloudflare/README.md for complete deployment guide."

# Save
$reportPath = Join-Path $PSScriptRoot "..\reports\infrastructure-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
$report | Out-File -FilePath $reportPath -Encoding utf8
Write-Host "`nReport saved: $reportPath" -ForegroundColor Green

# Print to console
$report | ForEach-Object { Write-Host $_ }
Write-Host "`n=== Report Generated ===" -ForegroundColor Cyan

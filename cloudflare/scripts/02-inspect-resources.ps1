# EterPay Cloudflare Infrastructure Automation Scripts
# Script 02: Inspect existing Cloudflare resources
# Usage: $env:CF_API_TOKEN = "your_token"; .\02-inspect-resources.ps1

param(
    [string]$AccountId = "e233b39f3904bf6467d237c883cdd381"
)

if (-not $env:CF_API_TOKEN) {
    Write-Error "CF_API_TOKEN environment variable is not set."
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $env:CF_API_TOKEN"
    "Content-Type"  = "application/json"
}

$reportLines = @()
$reportLines += "# EterPay Cloudflare Resource Inspection Report"
$reportLines += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') UTC"
$reportLines += "Account ID: $AccountId"
$reportLines += ""

Write-Host "`n=== EterPay Cloudflare Resource Inspector ===" -ForegroundColor Cyan

# Workers
Write-Host "`n[Workers]" -ForegroundColor Yellow
$reportLines += "## Workers"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/workers/scripts" -Headers $headers
    if ($r.success -and $r.result.Count -gt 0) {
        $r.result | ForEach-Object {
            Write-Host "  - $($_.id) [modified: $($_.modified_on)]"
            $reportLines += "- $($_.id) (modified: $($_.modified_on))"
        }
    } else {
        Write-Host "  No Workers found." -ForegroundColor Gray
        $reportLines += "- None"
    }
} catch { Write-Host "  Could not list Workers: $_" -ForegroundColor Red; $reportLines += "- Error: $_" }

# Cloudflare Pages
Write-Host "`n[Pages Projects]" -ForegroundColor Yellow
$reportLines += "`n## Pages Projects"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects" -Headers $headers
    if ($r.success -and $r.result.Count -gt 0) {
        $r.result | ForEach-Object {
            $deployUrl = if ($_.latest_deployment) { $_.latest_deployment.url } else { 'no deployment' }
            Write-Host "  - $($_.name) -> $deployUrl"
            $reportLines += "- $($_.name) -> $deployUrl"
        }
    } else {
        Write-Host "  No Pages projects found." -ForegroundColor Gray
        $reportLines += "- None"
    }
} catch { Write-Host "  Could not list Pages: $_" -ForegroundColor Red; $reportLines += "- Error: $_" }

# D1 Databases
Write-Host "`n[D1 Databases]" -ForegroundColor Yellow
$reportLines += "`n## D1 Databases"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/d1/database" -Headers $headers
    if ($r.success -and $r.result.Count -gt 0) {
        $r.result | ForEach-Object {
            Write-Host "  - $($_.name) (UUID: $($_.uuid))"
            $reportLines += "- $($_.name) (UUID: $($_.uuid))"
        }
    } else {
        Write-Host "  No D1 databases found." -ForegroundColor Gray
        $reportLines += "- None"
    }
} catch { Write-Host "  Could not list D1: $_" -ForegroundColor Red; $reportLines += "- Error: $_" }

# KV Namespaces
Write-Host "`n[KV Namespaces]" -ForegroundColor Yellow
$reportLines += "`n## KV Namespaces"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/storage/kv/namespaces" -Headers $headers
    if ($r.success -and $r.result.Count -gt 0) {
        $r.result | ForEach-Object {
            Write-Host "  - $($_.title) (ID: $($_.id))"
            $reportLines += "- $($_.title) (ID: $($_.id))"
        }
    } else {
        Write-Host "  No KV namespaces found." -ForegroundColor Gray
        $reportLines += "- None"
    }
} catch { Write-Host "  Could not list KV: $_" -ForegroundColor Red; $reportLines += "- Error: $_" }

# R2 Buckets
Write-Host "`n[R2 Buckets]" -ForegroundColor Yellow
$reportLines += "`n## R2 Buckets"
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/r2/buckets" -Headers $headers
    if ($r.success -and $r.result.buckets.Count -gt 0) {
        $r.result.buckets | ForEach-Object {
            Write-Host "  - $($_.name)"
            $reportLines += "- $($_.name)"
        }
    } else {
        Write-Host "  No R2 buckets found." -ForegroundColor Gray
        $reportLines += "- None"
    }
} catch { Write-Host "  Could not list R2: $_" -ForegroundColor Red; $reportLines += "- Error: $_" }

# Save report
$reportPath = Join-Path $PSScriptRoot "..\reports\resource-inspection-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
$reportLines | Out-File -FilePath $reportPath -Encoding utf8
Write-Host "`nReport saved to: $reportPath" -ForegroundColor Green
Write-Host "=== Inspection Complete ===" -ForegroundColor Cyan

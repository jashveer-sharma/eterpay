# EterPay Cloudflare Infrastructure Automation Scripts
# Script 01: Verify Cloudflare account access and token permissions
# Usage: $env:CF_API_TOKEN = "your_token"; .\01-verify-account.ps1

param(
    [string]$AccountId = "e233b39f3904bf6467d237c883cdd381"
)

if (-not $env:CF_API_TOKEN) {
    Write-Error "CF_API_TOKEN environment variable is not set. Set it with: `$env:CF_API_TOKEN = 'your_token'"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $env:CF_API_TOKEN"
    "Content-Type"  = "application/json"
}

Write-Host "`n=== EterPay Cloudflare Account Verification ===" -ForegroundColor Cyan
Write-Host "Account ID: $AccountId"
Write-Host "Timestamp : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"

# 1. Verify token
Write-Host "`n[1/4] Verifying API token..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" -Headers $headers
    if ($r.success) {
        Write-Host "  OK  Token is valid and active (ID: $($r.result.id))" -ForegroundColor Green
    } else {
        Write-Error "  FAIL  Token verification failed: $($r.errors | ConvertTo-Json)"
        exit 1
    }
} catch {
    Write-Error "  FAIL  Could not reach Cloudflare API: $_"
    exit 1
}

# 2. Get account info
Write-Host "`n[2/4] Getting account information..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId" -Headers $headers
    if ($r.success) {
        Write-Host "  OK  Account: $($r.result.name)" -ForegroundColor Green
        Write-Host "       Type  : $($r.result.type)"
    } else {
        Write-Host "  WARN  Could not get account details (may need Account:Read permission)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  WARN  Account details unavailable: $_" -ForegroundColor Yellow
}

# 3. List token permissions
Write-Host "`n[3/4] Checking token permissions..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens" -Headers $headers
    if ($r.success) {
        $token = $r.result | Where-Object { $_.id -eq $env:CF_TOKEN_ID } | Select-Object -First 1
        Write-Host "  OK  Token details accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "  INFO  Token list requires additional permissions" -ForegroundColor Gray
}

# 4. Test Pages access
Write-Host "`n[4/4] Checking Cloudflare Pages access..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects" -Headers $headers
    if ($r.success) {
        $count = ($r.result | Measure-Object).Count
        Write-Host "  OK  Pages API accessible -- $count existing project(s)" -ForegroundColor Green
        if ($count -gt 0) {
            $r.result | ForEach-Object {
                $depUrl = if ($_.latest_deployment) { $_.latest_deployment.url } else { 'no deployment' }
                Write-Host "       - $($_.name) [$depUrl]"
            }
        }
    }
} catch {
    Write-Host "  WARN  Pages API not accessible (may need Cloudflare Pages:Edit permission)" -ForegroundColor Yellow
}

Write-Host "`n=== Verification Complete ===" -ForegroundColor Cyan
Write-Host "Account ID  : $AccountId"
Write-Host "Token Status: ACTIVE"
Write-Host ""

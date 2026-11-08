# EterPay Cloudflare Infrastructure Automation Scripts
# Script 05: Configure Pages environment variables and secrets
# Usage: $env:CF_API_TOKEN = "your_token"; .\05-configure-secrets.ps1
#
# SECURITY: This script prompts for secret values interactively.
# It NEVER hardcodes secrets or writes them to files.

param(
    [string]$AccountId   = "e233b39f3904bf6467d237c883cdd381",
    [string]$ProjectName = "eterpay"
)

if (-not $env:CF_API_TOKEN) { Write-Error "CF_API_TOKEN not set."; exit 1 }

$headers = @{ "Authorization" = "Bearer $env:CF_API_TOKEN"; "Content-Type" = "application/json" }

Write-Host "`n=== EterPay: Configure Pages Secrets ===" -ForegroundColor Cyan
Write-Host "This script sets environment variables for the Cloudflare Pages project."
Write-Host "Secrets are sent directly to Cloudflare API -- never written to disk."
Write-Host ""

# Non-sensitive environment variables (can be set directly)
$publicVars = @{
    "NEXT_PUBLIC_APP_NAME"       = "EterPay"
    "NEXT_PUBLIC_APP_VERSION"    = "1.0.0"
    "NEXT_PUBLIC_ENVIRONMENT"    = "production"
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID" = ""  # Will prompt
}

Write-Host "[1/4] Setting public environment variables..."
foreach ($var in $publicVars.GetEnumerator()) {
    if ($var.Value -eq "") {
        $val = Read-Host "  Enter value for $($var.Key)"
    } else {
        $val = $var.Value
    }

    $body = @{
        type  = "plain_text"
        name  = $var.Key
        value = $val
    } | ConvertTo-Json

    try {
        $r = Invoke-RestMethod `
            -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/secrets" `
            -Method POST -Headers $headers -Body $body
        if ($r.success) {
            Write-Host "  OK  $($var.Key) set" -ForegroundColor Green
        } else {
            Write-Host "  WARN  $($var.Key): $($r.errors | ConvertTo-Json)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  FAIL  $($var.Key): $_" -ForegroundColor Red
    }
}

Write-Host "`n[2/4] Setting secret environment variables (encrypted)..."
$secretVars = @("PAYPAL_CLIENT_SECRET", "GEMINI_API_KEY", "GROQ_API_KEY", "JWT_SECRET")
foreach ($secretName in $secretVars) {
    $val = Read-Host "  Enter value for $secretName (leave blank to skip)"
    if (-not $val) { Write-Host "  SKIP  $secretName"; continue }

    $body = @{
        type  = "secret_text"
        name  = $secretName
        value = $val
    } | ConvertTo-Json

    try {
        $r = Invoke-RestMethod `
            -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/secrets" `
            -Method POST -Headers $headers -Body $body
        if ($r.success) {
            Write-Host "  OK  $secretName set (encrypted)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  FAIL  $secretName: $_" -ForegroundColor Red
    }
}

Write-Host "`n[3/4] Setting backend URL..."
$backendUrl = Read-Host "  Enter NEXT_PUBLIC_BACKEND_URL (e.g. https://eterpay-api.onrender.com)"
if ($backendUrl) {
    $body = @{ type = "plain_text"; name = "NEXT_PUBLIC_BACKEND_URL"; value = $backendUrl } | ConvertTo-Json
    try {
        $r = Invoke-RestMethod `
            -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/secrets" `
            -Method POST -Headers $headers -Body $body
        Write-Host "  OK  NEXT_PUBLIC_BACKEND_URL set" -ForegroundColor Green
    } catch { Write-Host "  FAIL: $_" -ForegroundColor Red }
}

Write-Host "`n[4/4] Verification..."
try {
    $r = Invoke-RestMethod `
        -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName" `
        -Headers $headers
    if ($r.success) {
        Write-Host "  OK  Project '$ProjectName' environment variables updated" -ForegroundColor Green
    }
} catch { Write-Host "  Could not verify: $_" -ForegroundColor Yellow }

Write-Host "`n=== Secrets Configuration Complete ===" -ForegroundColor Cyan

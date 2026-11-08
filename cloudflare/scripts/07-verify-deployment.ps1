# EterPay Cloudflare Infrastructure Automation Scripts
# Script 07: Verify deployment -- smoke test public endpoints
# Usage: $env:CF_API_TOKEN = "your_token"; .\07-verify-deployment.ps1

param(
    [string]$AccountId   = "e233b39f3904bf6467d237c883cdd381",
    [string]$ProjectName = "eterpay",
    [string]$CustomUrl   = ""  # e.g. https://eterpay.pages.dev
)

if (-not $env:CF_API_TOKEN) { Write-Error "CF_API_TOKEN not set."; exit 1 }

$headers = @{ "Authorization" = "Bearer $env:CF_API_TOKEN" }

Write-Host "`n=== EterPay: Deployment Verification ===" -ForegroundColor Cyan

# Get the latest deployment URL
if (-not $CustomUrl) {
    try {
        $r = Invoke-RestMethod `
            -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName" `
            -Headers $headers
        if ($r.success) {
            $CustomUrl = "https://$($r.result.subdomain)"
            Write-Host "Target URL: $CustomUrl"
        }
    } catch {
        Write-Host "Could not get project URL -- please provide -CustomUrl parameter" -ForegroundColor Red
        exit 1
    }
}

$results = @()

function Test-Endpoint {
    param([string]$Url, [string]$Name, [int]$ExpectedStatus = 200)
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 15 -SkipHttpErrorCheck
        $ok = $response.StatusCode -eq $ExpectedStatus
        $status = if ($ok) { "PASS" } else { "FAIL" }
        $color  = if ($ok) { "Green" } else { "Red" }
        Write-Host "  [$status] $Name ($($response.StatusCode))" -ForegroundColor $color
        return @{ Name=$Name; Status=$status; Code=$response.StatusCode; Url=$Url }
    } catch {
        Write-Host "  [ERROR] $Name -- $_" -ForegroundColor Red
        return @{ Name=$Name; Status="ERROR"; Code=0; Url=$Url }
    }
}

# Test public routes
Write-Host "`n[Frontend Routes]" -ForegroundColor Yellow
$results += Test-Endpoint "$CustomUrl/" "Homepage"
$results += Test-Endpoint "$CustomUrl/login" "Login page"
$results += Test-Endpoint "$CustomUrl/signup" "Signup page"
$results += Test-Endpoint "$CustomUrl/about" "About page"
$results += Test-Endpoint "$CustomUrl/dashboard" "Dashboard"

# Test backend API (if deployed)
$backendUrl = if ($env:NEXT_PUBLIC_BACKEND_URL) { $env:NEXT_PUBLIC_BACKEND_URL } else { "https://eterpay-api.onrender.com" }
Write-Host "`n[Backend API -- $backendUrl]" -ForegroundColor Yellow
$results += Test-Endpoint "$backendUrl/health" "Health check"
$results += Test-Endpoint "$backendUrl/api/currency/rates" "Currency rates"

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$total  = $results.Count
Write-Host "Passed: $passed/$total"

$reportContent = "# EterPay Deployment Verification`n`nTimestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`nURL: $CustomUrl`n`n## Results`n"
$results | ForEach-Object { $reportContent += "- [$($_.Status)] $($_.Name) -> $($_.Url) ($($_.Code))`n" }
$reportContent | Out-File (Join-Path $PSScriptRoot "..\reports\verification-$(Get-Date -Format 'yyyyMMdd-HHmmss').md") -Encoding utf8

Write-Host "`n=== Verification Complete ===" -ForegroundColor Cyan

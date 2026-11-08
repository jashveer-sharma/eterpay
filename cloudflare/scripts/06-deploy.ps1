# EterPay Cloudflare Infrastructure Automation Scripts
# Script 06: Deploy frontend to Cloudflare Pages via Direct Upload
# REQUIRES: @cloudflare/next-on-pages to be installed in frontend/
# Usage: $env:CF_API_TOKEN = "your_token"; .\06-deploy.ps1
#
# IMPORTANT: This script DOES NOT push to GitHub.
# It uses Cloudflare Pages Direct Upload (Wrangler).
# You MUST approve deployment by running this script explicitly.

param(
    [string]$AccountId   = "e233b39f3904bf6467d237c883cdd381",
    [string]$ProjectName = "eterpay",
    [switch]$DryRun
)

if (-not $env:CF_API_TOKEN) { Write-Error "CF_API_TOKEN not set."; exit 1 }

$frontendDir = Join-Path $PSScriptRoot "..\..\frontend"
$rootDir     = Join-Path $PSScriptRoot "..\..\"

Write-Host "`n=== EterPay: Deploy to Cloudflare Pages ===" -ForegroundColor Cyan
Write-Host "Project  : $ProjectName"
Write-Host "Frontend : $frontendDir"
Write-Host "Mode     : $(if ($DryRun) { 'DRY RUN' } else { 'LIVE DEPLOYMENT' })"
Write-Host ""

if (-not $DryRun) {
    $confirm = Read-Host "[!]  This will deploy EterPay publicly. Proceed? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Aborted." -ForegroundColor Yellow
        exit 0
    }
}

# Step 1: Install @cloudflare/next-on-pages
Write-Host "`n[1/5] Installing @cloudflare/next-on-pages..." -ForegroundColor Yellow
Push-Location $frontendDir
try {
    npm install --save-dev @cloudflare/next-on-pages wrangler
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    Write-Host "  OK  Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "  FAIL: $_" -ForegroundColor Red
    Pop-Location; exit 1
}

# Step 2: Build with next-on-pages
Write-Host "`n[2/5] Building Next.js for Cloudflare Pages..." -ForegroundColor Yellow
try {
    npx @cloudflare/next-on-pages
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    Write-Host "  OK  Build complete" -ForegroundColor Green
} catch {
    Write-Host "  FAIL: $_" -ForegroundColor Red
    Pop-Location; exit 1
}

Pop-Location

# Step 3: Deploy via Wrangler
Write-Host "`n[3/5] Deploying to Cloudflare Pages..." -ForegroundColor Yellow
if ($DryRun) {
    Write-Host "  DRY RUN -- skipping actual deployment" -ForegroundColor Yellow
} else {
    Push-Location $frontendDir
    try {
        $env:CLOUDFLARE_API_TOKEN = $env:CF_API_TOKEN
        npx wrangler pages deploy .vercel/output/static --project-name=$ProjectName --branch=main
        if ($LASTEXITCODE -ne 0) { throw "Deployment failed" }
        Write-Host "  OK  Deployment initiated" -ForegroundColor Green
    } catch {
        Write-Host "  FAIL: $_" -ForegroundColor Red
        Pop-Location; exit 1
    }
    Pop-Location
}

# Step 4: Verify
Write-Host "`n[4/5] Verifying deployment..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $env:CF_API_TOKEN" }
try {
    $r = Invoke-RestMethod `
        -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName/deployments" `
        -Headers $headers
    if ($r.success -and $r.result.Count -gt 0) {
        $latest = $r.result[0]
        Write-Host "  OK  Latest deployment: $($latest.url)" -ForegroundColor Green
        Write-Host "       Status: $($latest.latest_stage.name) -- $($latest.latest_stage.status)"
    }
} catch {
    Write-Host "  Could not verify deployment status: $_" -ForegroundColor Yellow
}

# Step 5: Summary
Write-Host "`n[5/5] Deployment Summary" -ForegroundColor Yellow
Write-Host "  Project    : https://$ProjectName.pages.dev"
Write-Host "  Custom URL : Configure in Cloudflare Dashboard > Pages > $ProjectName > Custom Domains"
Write-Host "  Next steps :"
Write-Host "    - Run .\07-verify-deployment.ps1 to smoke test"
Write-Host "    - Run .\08-generate-report.ps1 for infrastructure report"
Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan

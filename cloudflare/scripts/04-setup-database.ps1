# EterPay Cloudflare Infrastructure Automation Scripts
# Script 04: Create D1 database (idempotent)
# Usage: $env:CF_API_TOKEN = "your_token"; .\04-setup-database.ps1

param(
    [string]$AccountId = "e233b39f3904bf6467d237c883cdd381",
    [string]$DbName    = "eterpay-db"
)

if (-not $env:CF_API_TOKEN) { Write-Error "CF_API_TOKEN not set."; exit 1 }

$headers = @{ "Authorization" = "Bearer $env:CF_API_TOKEN"; "Content-Type" = "application/json" }

Write-Host "`n=== EterPay: Setup D1 Database ===" -ForegroundColor Cyan
Write-Host "NOTE: D1 is optional. EterPay currently uses SQLite (FastAPI backend on Render)."
Write-Host "      D1 would be used if migrating to a Cloudflare Workers-based API."

# Check for existing database
Write-Host "`n[1/3] Checking for existing D1 database '$DbName'..."
$existing = $null
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/d1/database" -Headers $headers
    if ($r.success) {
        $existing = $r.result | Where-Object { $_.name -eq $DbName } | Select-Object -First 1
        if ($existing) {
            Write-Host "  OK  Database '$DbName' already exists (UUID: $($existing.uuid))" -ForegroundColor Green
            exit 0
        } else {
            Write-Host "  INFO  Database '$DbName' not found -- will create." -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  WARN  Could not list databases: $_" -ForegroundColor Yellow
}

# Confirm before creating
Write-Host "`n[2/3] About to create D1 database '$DbName'."
$confirm = Read-Host "Proceed? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

# Create database
$body = @{ name = $DbName } | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/d1/database" `
        -Method POST -Headers $headers -Body $body
    if ($r.success) {
        Write-Host "  OK  D1 database created!" -ForegroundColor Green
        Write-Host "       Name : $($r.result.name)"
        Write-Host "       UUID : $($r.result.uuid)"

        # Save UUID for wrangler.toml
        $envPath = Join-Path $PSScriptRoot "..\environment\d1-database.json"
        $r.result | ConvertTo-Json | Out-File -FilePath $envPath -Encoding utf8
        Write-Host "       Info saved: $envPath"
        Write-Host ""
        Write-Host "  IMPORTANT: Update wrangler.toml with database_id = '$($r.result.uuid)'" -ForegroundColor Yellow
    } else {
        Write-Error "  FAIL: $($r.errors | ConvertTo-Json)"
    }
} catch {
    Write-Error "  FAIL: $_"
}

Write-Host "`n[3/3] Apply migrations:"
Write-Host "  npx wrangler d1 execute $DbName --file=../migrations/0001_init.sql"
Write-Host ""
Write-Host "=== D1 Setup Complete ===" -ForegroundColor Cyan

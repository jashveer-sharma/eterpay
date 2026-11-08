# EterPay Cloudflare Infrastructure Automation Scripts
# Script 03: Create Cloudflare Pages project (idempotent)
# Usage: $env:CF_API_TOKEN = "your_token"; .\03-setup-pages.ps1

param(
    [string]$AccountId    = "e233b39f3904bf6467d237c883cdd381",
    [string]$ProjectName  = "eterpay",
    [string]$ProductionBranch = "main"
)

if (-not $env:CF_API_TOKEN) { Write-Error "CF_API_TOKEN not set."; exit 1 }

$headers = @{ "Authorization" = "Bearer $env:CF_API_TOKEN"; "Content-Type" = "application/json" }

Write-Host "`n=== EterPay: Setup Cloudflare Pages ===" -ForegroundColor Cyan

# Check if project already exists
Write-Host "`n[1/3] Checking if Pages project '$ProjectName' already exists..."
$existing = $null
try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects/$ProjectName" -Headers $headers
    if ($r.success) {
        $existing = $r.result
        Write-Host "  OK  Project '$ProjectName' already exists (URL: $($existing.subdomain))" -ForegroundColor Green
    }
} catch {
    Write-Host "  INFO  Project not found -- will create." -ForegroundColor Gray
}

if ($existing) {
    Write-Host "`nProject already set up. Skipping creation." -ForegroundColor Green
    Write-Host "Pages URL: https://$($existing.subdomain)"
    exit 0
}

# Create the Pages project
Write-Host "`n[2/3] Creating Cloudflare Pages project '$ProjectName'..."
$body = @{
    name              = $ProjectName
    production_branch = $ProductionBranch
} | ConvertTo-Json

try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$AccountId/pages/projects" `
        -Method POST -Headers $headers -Body $body
    if ($r.success) {
        Write-Host "  OK  Project created successfully!" -ForegroundColor Green
        Write-Host "       Project Name : $($r.result.name)"
        Write-Host "       Pages URL    : https://$($r.result.subdomain)"
        Write-Host "       Build Cmd    : npm run build (set in dashboard or deploy script)"

        # Save the project info
        $infoPath = Join-Path $PSScriptRoot "..\environment\pages-project.json"
        $r.result | ConvertTo-Json -Depth 5 | Out-File -FilePath $infoPath -Encoding utf8
        Write-Host "       Info saved   : $infoPath"
    } else {
        Write-Error "  FAIL  Project creation failed: $($r.errors | ConvertTo-Json)"
        exit 1
    }
} catch {
    Write-Error "  FAIL  API call failed: $_"
    exit 1
}

Write-Host "`n[3/3] Next steps:"
Write-Host "  1. Connect your GitHub repo in the Cloudflare dashboard"
Write-Host "     OR use .\06-deploy.ps1 for direct upload deployment"
Write-Host "  2. Set environment variables via .\05-configure-secrets.ps1"
Write-Host "  3. Set build command: npm run build"
Write-Host "  4. Set output directory: .vercel/output/static (after @cloudflare/next-on-pages)"
Write-Host ""
Write-Host "=== Pages Setup Complete ===" -ForegroundColor Cyan

# MongoDB Startup Script
# This script helps you start MongoDB

Write-Host "=== MongoDB Startup Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is already running
$connection = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($connection) {
    Write-Host "✓ MongoDB is already running on port 27017" -ForegroundColor Green
    exit 0
}

Write-Host "MongoDB is not running. Here are your options:" -ForegroundColor Yellow
Write-Host ""

# Option 1: Check for MongoDB service
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "Found MongoDB service. Starting it..." -ForegroundColor Cyan
    try {
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 2
        Write-Host "✓ MongoDB service started successfully!" -ForegroundColor Green
        Write-Host "You can now run: npm start" -ForegroundColor Cyan
    } catch {
        Write-Host "✗ Failed to start MongoDB service: $_" -ForegroundColor Red
        Write-Host "Try running PowerShell as Administrator" -ForegroundColor Yellow
    }
} else {
    Write-Host "MongoDB service not found." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Install MongoDB as a Windows Service"
    Write-Host "2. Use MongoDB Atlas (cloud) - Recommended"
    Write-Host "3. Start MongoDB manually"
    Write-Host ""
    Write-Host "For MongoDB Atlas setup, see: MONGODB_SETUP.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To install MongoDB locally:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.mongodb.com/try/download/community"
    Write-Host "2. Run the installer"
    Write-Host "3. Choose 'Install MongoDB as a Service' option"
    Write-Host ""
}



# SMI Project Setup Diagnostic Script
# Run this to check if everything is configured correctly

Write-Host "`n=== SMI Project Setup Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found! Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "`n2. Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
Write-Host "`n3. Checking dependencies..." -ForegroundColor Yellow
$serverNodeModules = Test-Path ".\node_modules"
$clientNodeModules = Test-Path "..\client\node_modules"

if ($serverNodeModules) {
    Write-Host "   ✅ Server dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Server dependencies missing! Run: npm install" -ForegroundColor Red
}

if ($clientNodeModules) {
    Write-Host "   ✅ Client dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Client dependencies missing! Run: cd ..\client && npm install" -ForegroundColor Yellow
}

# Check .env file
Write-Host "`n4. Checking .env file..." -ForegroundColor Yellow
$envFile = ".\.env"
if (Test-Path $envFile) {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content $envFile -Raw
    $requiredVars = @("MONGO_URI", "JWT_SECRET")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=") {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "   ✅ Required environment variables found" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Missing variables: $($missingVars -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ .env file not found! Create it in the server folder" -ForegroundColor Red
    Write-Host "   See SETUP_NEW_LAPTOP.md for required variables" -ForegroundColor Gray
}

# Check MongoDB
Write-Host "`n5. Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
    if ($mongoService) {
        if ($mongoService.Status -eq "Running") {
            Write-Host "   ✅ MongoDB service is running" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  MongoDB service exists but is not running" -ForegroundColor Yellow
            Write-Host "   Run: Start-Service MongoDB" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  MongoDB service not found (might be using Atlas or not installed)" -ForegroundColor Yellow
        Write-Host "   If using local MongoDB, install it from https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Could not check MongoDB service (might be using Atlas)" -ForegroundColor Yellow
}

# Check if port 5000 is in use
Write-Host "`n6. Checking port 5000..." -ForegroundColor Yellow
try {
    $portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "   ⚠️  Port 5000 is already in use" -ForegroundColor Yellow
        Write-Host "   This might be your server running, or another application" -ForegroundColor Gray
    } else {
        Write-Host "   ✅ Port 5000 is available" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✅ Port 5000 appears to be available" -ForegroundColor Green
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. If dependencies are missing, run: npm install" -ForegroundColor White
Write-Host "2. If .env is missing, create it with required variables (see SETUP_NEW_LAPTOP.md)" -ForegroundColor White
Write-Host "3. Start MongoDB (if using local): Start-Service MongoDB" -ForegroundColor White
Write-Host "4. Start backend server: npm start" -ForegroundColor White
Write-Host "5. Start frontend (in another terminal): cd ..\client && npm start" -ForegroundColor White
Write-Host ""


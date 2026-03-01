# ngrok Helper Script for NOWPayments Webhook Testing
# This script helps you start ngrok for webhook testing

$ngrokPath = "$env:USERPROFILE\ngrok\ngrok.exe"

if (-not (Test-Path $ngrokPath)) {
    Write-Host "ngrok not found at $ngrokPath" -ForegroundColor Red
    Write-Host "Please download ngrok from https://ngrok.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting ngrok on port 5000..." -ForegroundColor Green
Write-Host "Your webhook URL will be: https://YOUR-NGROK-URL.ngrok-free.app/api/deposit/webhook" -ForegroundColor Cyan
Write-Host ""
Write-Host "After ngrok starts, copy the HTTPS URL and:" -ForegroundColor Yellow
Write-Host "1. Update server/.env: NOWPAYMENTS_CALLBACK_URL=https://YOUR-URL/api/deposit/webhook" -ForegroundColor Yellow
Write-Host "2. Update NOWPayments dashboard IPN settings with the same URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop ngrok" -ForegroundColor Gray
Write-Host ""

# Start ngrok
& $ngrokPath http 5000








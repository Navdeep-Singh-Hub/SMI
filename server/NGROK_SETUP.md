# ngrok Setup for NOWPayments Webhook Testing

## Quick Setup Guide

### Step 1: Install ngrok

**Option A: Download (Recommended)**
1. Go to https://ngrok.com/download
2. Download ngrok for Windows
3. Extract the `ngrok.exe` file
4. Add ngrok to your PATH or place it in a folder you can access

**Option B: Using Chocolatey (if installed)**
```powershell
choco install ngrok
```

**Option C: Using Scoop (if installed)**
```powershell
scoop install ngrok
```

### Step 2: Sign up for ngrok (Free)

1. Go to https://dashboard.ngrok.com/signup
2. Create a free account
3. Get your authtoken from the dashboard
4. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

### Step 3: Start Your Server

In one terminal, start your server:
```powershell
cd D:\Projects\SMI\server
npm start
```

Your server should be running on `http://localhost:5000`

### Step 4: Start ngrok

In a **new terminal**, run:
```powershell
ngrok http 5000
```

You'll see output like:
```
Forwarding   https://abc123def456.ngrok-free.app -> http://localhost:5000
```

### Step 5: Copy Your ngrok URL

Copy the HTTPS URL (e.g., `https://abc123def456.ngrok-free.app`)

### Step 6: Update .env File

Update `server/.env` with your ngrok URL:
```env
NOWPAYMENTS_CALLBACK_URL=https://abc123def456.ngrok-free.app/api/deposit/webhook
```

Replace `abc123def456.ngrok-free.app` with your actual ngrok URL.

### Step 7: Update NOWPayments Dashboard

1. Log in to NOWPayments dashboard
2. Go to **Settings** → **Instant Payment Notifications (IPN)**
3. Set **IPN Callback URL** to: `https://YOUR-NGROK-URL.ngrok-free.app/api/deposit/webhook`
4. Save settings

### Step 8: Restart Your Server

After updating `.env`, restart your server:
```powershell
# Stop the server (Ctrl+C)
# Then start again
npm start
```

## Testing the Webhook

1. **Start ngrok** (keep it running):
   ```powershell
   ngrok http 5000
   ```

2. **Start your server**:
   ```powershell
   cd D:\Projects\SMI\server
   npm start
   ```

3. **Test webhook**:
   - Create a deposit in your app
   - Complete payment via NOWPayments
   - Check ngrok web interface: http://localhost:4040
   - Check server logs for webhook requests

## ngrok Web Interface

While ngrok is running, you can view requests at:
- **Local**: http://localhost:4040
- This shows all incoming requests, including webhooks

## Important Notes

1. **Free ngrok URLs change** each time you restart ngrok (unless you have a paid plan)
   - You'll need to update `.env` and NOWPayments dashboard each time
   - Consider using a static domain with paid ngrok plan

2. **Keep ngrok running** while testing
   - If you close ngrok, webhooks won't reach your server

3. **HTTPS is required** for NOWPayments webhooks
   - ngrok provides HTTPS automatically

4. **ngrok free tier** has limitations:
   - URLs expire after 2 hours of inactivity
   - Limited requests per minute

## Troubleshooting

### ngrok not found
- Make sure ngrok is in your PATH
- Or use full path: `C:\path\to\ngrok.exe http 5000`

### Webhook not received
- Check ngrok is running: http://localhost:4040
- Verify URL in NOWPayments dashboard matches ngrok URL
- Check server logs for incoming requests
- Ensure server is running on port 5000

### Connection refused
- Make sure your server is running before starting ngrok
- Verify server is on port 5000

## Alternative: Use ngrok with Static Domain (Paid)

If you have ngrok paid plan:
```powershell
ngrok http 5000 --domain=your-static-domain.ngrok.io
```

This gives you a permanent URL that doesn't change.








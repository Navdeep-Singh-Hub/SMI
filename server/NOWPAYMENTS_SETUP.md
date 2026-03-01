# NOWPayments Integration Setup Guide

## Overview
This guide will help you set up NOWPayments cryptocurrency payment gateway for automatic payment processing and balance updates.

## Prerequisites
- NOWPayments account (sign up at https://nowpayments.io/)
- Server running and accessible from the internet (for webhooks)
- Domain name or ngrok for local testing

## Step 1: Create NOWPayments Account

1. **Sign Up**: Go to https://nowpayments.io/ and create an account
2. **Verify Email**: Complete email verification
3. **Complete KYC**: Complete Know Your Customer verification (required for production)

## Step 2: Get API Credentials

### Get API Key
1. Log in to NOWPayments dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the API key (starts with something like `YOUR_API_KEY_...`)
5. **Important**: Save this key securely - you won't be able to see it again

### Get IPN Secret Key
1. In dashboard, go to **Settings** → **Instant Payment Notifications (IPN)**
2. Click **Generate IPN Secret Key**
3. Copy the secret key
4. **Important**: Save this key securely

## Step 3: Configure Webhook URL

### For Production:
1. Your webhook URL should be: `https://yourdomain.com/api/deposit/webhook`
2. In NOWPayments dashboard, go to **Settings** → **IPN Settings**
3. Set the **IPN Callback URL** to your webhook URL
4. Save the settings

### For Local Development (using ngrok):
1. Install ngrok: https://ngrok.com/download
2. Start your server: `npm start` (runs on port 5000)
3. In a new terminal, run: `ngrok http 5000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Your webhook URL: `https://abc123.ngrok.io/api/deposit/webhook`
6. Update this in NOWPayments dashboard IPN settings

## Step 4: Configure Environment Variables

Edit `server/.env` file and add:

```env
# NOWPayments Configuration
NOWPAYMENTS_API_KEY=your-api-key-here
NOWPAYMENTS_IPN_SECRET=your-ipn-secret-here
NOWPAYMENTS_BASE_CURRENCY=USD
NOWPAYMENTS_CALLBACK_URL=https://yourdomain.com/api/deposit/webhook
NOWPAYMENTS_SANDBOX=false
FRONTEND_URL=https://yourdomain.com
```

### For Testing (Sandbox):
```env
NOWPAYMENTS_SANDBOX=true
NOWPAYMENTS_CALLBACK_URL=http://localhost:5000/api/deposit/webhook
FRONTEND_URL=http://localhost:3000
```

**Important Notes**:
- Replace `your-api-key-here` with your actual API key
- Replace `your-ipn-secret-here` with your actual IPN secret
- Update `NOWPAYMENTS_CALLBACK_URL` with your actual webhook URL
- Set `NOWPAYMENTS_SANDBOX=true` for testing, `false` for production

## Step 5: Add Payout Wallet

1. In NOWPayments dashboard, go to **Settings** → **Payout Wallets**
2. Add wallet addresses for cryptocurrencies you want to receive
3. This is where payments will be sent to your account

## Step 6: Test the Integration

### Test Payment Flow:
1. Start your server: `cd server && npm start`
2. Start your client: `cd client && npm start`
3. Log in to your application
4. Go to Deposit page
5. Enter an amount (e.g., $10)
6. Click "Create Payment Invoice"
7. You should see:
   - Payment QR code
   - Payment address
   - "Open Payment Page" button
8. Complete a test payment via NOWPayments
9. Check that:
   - Webhook is received (check server logs)
   - Transaction status updates to "completed"
   - User balance increases automatically

### Verify Webhook:
- Check server logs for webhook requests
- Look for "Webhook processed successfully" messages
- Verify signature validation is working

## Step 7: Go Live

Once testing is complete:

1. **Switch to Production**:
   - Set `NOWPAYMENTS_SANDBOX=false` in `.env`
   - Update `NOWPAYMENTS_CALLBACK_URL` to production URL
   - Update `FRONTEND_URL` to production URL

2. **Verify Production Settings**:
   - API key is production key (not sandbox)
   - Webhook URL is accessible from internet
   - IPN secret is configured correctly

3. **Monitor**:
   - Check server logs for webhook processing
   - Monitor transaction statuses
   - Verify balance updates are working

## Troubleshooting

### Webhook Not Received
- **Check URL**: Ensure webhook URL is accessible from internet
- **Check Firewall**: Ensure port is open
- **Check Logs**: Look for webhook requests in server logs
- **Test with ngrok**: Use ngrok for local testing

### Invalid Signature Error
- **Verify IPN Secret**: Ensure `NOWPAYMENTS_IPN_SECRET` matches dashboard
- **Check Raw Body**: Webhook must receive raw body for signature verification
- **Check Headers**: Ensure `x-nowpayments-sig` header is present

### Payment Not Updating Balance
- **Check Webhook**: Verify webhook is being received
- **Check Status**: Payment status must be 'confirmed' or 'finished'
- **Check Logs**: Look for error messages in server logs
- **Verify Transaction**: Check transaction exists in database

### API Errors
- **Check API Key**: Verify API key is correct
- **Check Sandbox Mode**: Ensure sandbox setting matches your API key type
- **Check Rate Limits**: NOWPayments has rate limits
- **Check Currency**: Ensure base currency is supported

## API Endpoints Reference

### Create Payment
- **Endpoint**: `POST /api/deposit/create`
- **Auth**: Required (JWT token)
- **Body**: `{ amount: number }`
- **Returns**: Payment invoice URL, QR code, payment address

### Get Payment Status
- **Endpoint**: `GET /api/deposit/status/:transactionId`
- **Auth**: Required (JWT token)
- **Returns**: Current payment status

### Webhook (NOWPayments → Server)
- **Endpoint**: `POST /api/deposit/webhook`
- **Auth**: None (verified by signature)
- **Headers**: `x-nowpayments-sig` (signature)
- **Body**: Payment status update JSON

## Payment Status Flow

```
waiting → confirming → confirmed/finished (balance updated)
   ↓
failed (no balance update)
```

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use HTTPS** for webhook URLs in production
3. **Verify webhook signatures** (already implemented)
4. **Monitor webhook logs** for suspicious activity
5. **Rate limit webhook endpoint** if needed
6. **Validate payment amounts** match transaction amounts

## Support

- NOWPayments Documentation: https://nowpayments.io/help
- NOWPayments Support: support@nowpayments.io
- API Documentation: https://documenter.getpostman.com/view/7907941/T1LJjU52

## Next Steps

After setup:
1. Test with small amounts first
2. Monitor transactions and webhooks
3. Set up error alerts
4. Document your specific configuration
5. Train team on payment flow









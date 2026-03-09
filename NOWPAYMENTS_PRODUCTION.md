# NOWPayments in Production (Vercel + Render)

Use this checklist so deposits work with your **frontend on Vercel** and **backend on Render**.

---

## 1. Render (backend) environment variables

In **Render** → your web service → **Environment**:

| Variable | Value | Required |
|----------|--------|----------|
| `NOWPAYMENTS_API_KEY` | Your **production** API key from [NOWPayments](https://account.nowpayments.io/) → API Keys | Yes |
| `NOWPAYMENTS_IPN_SECRET` | Secret you set in NOWPayments IPN settings (must match exactly) | Yes |
| `NOWPAYMENTS_CALLBACK_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api/deposit/webhook` | Yes |
| `NOWPAYMENTS_SANDBOX` | `false` | Yes (use live payments) |
| `NOWPAYMENTS_BASE_CURRENCY` | `USD` | Optional (default) |
| `NOWPAYMENTS_PAY_CURRENCY` | e.g. `usdttrc20` (default crypto) | Optional |
| `FRONTEND_URL` | Your Vercel app URL, e.g. `https://smi-frontend.vercel.app` | Yes (for success/cancel redirects) |

Replace:

- `YOUR-RENDER-SERVICE` with your actual Render service name (e.g. `smi-api` → `https://smi-api.onrender.com/api/deposit/webhook`).
- `FRONTEND_URL` with your real Vercel URL (no trailing slash).

After changing env vars, **redeploy** the Render service.

---

## 2. NOWPayments dashboard

1. Log in at [NOWPayments](https://account.nowpayments.io/).
2. Go to **Settings** → **Instant Payment Notifications (IPN)**.
3. Set **IPN Callback URL** to the **same** as `NOWPAYMENTS_CALLBACK_URL`:
   - `https://YOUR-RENDER-SERVICE.onrender.com/api/deposit/webhook`
4. Set **IPN Secret** to the same value you put in `NOWPAYMENTS_IPN_SECRET` on Render.
5. Save. Use **production** API key (not sandbox) in Render when `NOWPAYMENTS_SANDBOX=false`.

---

## 3. Vercel (frontend) environment variable

The frontend must call your **Render API** (including `/api`):

1. **Vercel** → your project → **Settings** → **Environment Variables**.
2. Add or update:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://YOUR-RENDER-SERVICE.onrender.com/api`  
     (must include `/api` at the end)
   - **Environment:** Production (and Preview if you want).
3. **Redeploy** the frontend so the variable is used.

Without this, the app will call `http://localhost:5000/api`, requests will fail, and **balance will show $0.00** (or "—" / "Couldn't load balance"). Set `REACT_APP_API_URL` on Vercel and **redeploy** so the new value is baked into the build.

---

## 4. Balance shows $0 or "—"

- **Dashboard shows "—" or "Couldn't load balance"**  
  The frontend cannot reach the API. Ensure **Vercel** has `REACT_APP_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api` and redeploy. Open the browser console; you may see a warning if the app is using localhost as API URL.
- **Balance loads but is $0.00**  
  The user in your **production** database has no balance. To test without paying, run the credit script against the **same MongoDB** that Render uses (same `MONGO_URI`): from your machine, set `MONGO_URI` to the production Atlas URI and run e.g. `node server/scripts/credit-user.js --list` then `node server/scripts/credit-user.js 1 500`.

---

## 5. Quick checklist

- [ ] Render: `NOWPAYMENTS_API_KEY` (production key), `NOWPAYMENTS_IPN_SECRET`, `NOWPAYMENTS_CALLBACK_URL`, `NOWPAYMENTS_SANDBOX=false`, `FRONTEND_URL` set.
- [ ] NOWPayments dashboard: IPN Callback URL = Render webhook URL; IPN Secret matches Render.
- [ ] Vercel: `REACT_APP_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api` (with `/api`).
- [ ] Redeploy Render after env changes; redeploy Vercel after env changes.

---

## 6. Test

1. Open your Vercel app → log in → go to **Deposit**.
2. Enter an amount, choose a currency, click **Pay Now**.
3. You should get an invoice (QR code / payment page). After paying (or in sandbox, simulating), NOWPayments will call your Render webhook; balance should update.

If the invoice never appears, check Render logs for NOWPayments errors. If the balance does not update after payment, check that the IPN URL and secret match and that Render logs show a successful webhook (200).

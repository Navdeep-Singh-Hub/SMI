# Deploy SMI API (server) on Render

Deploy the **server** (Node/Express API) on Render so your Vercel frontend can use it in production.

---

## 1. Create a new Web Service

1. In your Render dashboard, open your project (or create one).
2. Click **"+ New"** → **"Web Service"**.
3. **Connect your GitHub** if not already: choose the repo **Navdeep-Singh-Hub/SMI**.

---

## 2. Configure the service

- **Name:** e.g. `smi-api` (this will be part of the URL: `https://smi-api.onrender.com`).
- **Region:** Pick one (e.g. Oregon).
- **Branch:** `main`.

**Root Directory (important)**  
Set to: **`server`**  
So Render builds and runs only the API, not the whole repo.

**Runtime:** **Node**.

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

(Or leave Build/Start blank; Render will run `npm install` and `npm start` by default when Root Directory is `server`.)

---

## 3. Environment variables

In the same page, open **"Environment"** or **"Environment Variables"** and add:

| Key | Value | Notes |
|-----|--------|--------|
| `NODE_ENV` | `production` | Optional |
| `PORT` | (leave empty) | Render sets this automatically |
| `MONGO_URI` | `mongodb+srv://...` | **Required.** Use MongoDB Atlas connection string |
| `JWT_SECRET` | (your secret) | Strong random string for legacy JWT (if used) |
| `AUTH0_DOMAIN` | `dev-13py8orx1jq30sww.us.auth0.com` | Your Auth0 domain |
| `AUTH0_AUDIENCE` | `https://smi-api` | Your Auth0 API identifier |
| `FRONTEND_URL` | `https://smi-trading.vercel.app` | For CORS; your Vercel app URL |
| `ADMIN_API_KEY` | (long random string) | Optional but needed to approve/reject KYC via `POST /api/admin/kyc/decision` |

KYC uploads are saved under `server/uploads/kyc/`. On Render, disk is **ephemeral** — consider cloud storage for production. See `KYC_AND_PROFILE.md`.

| `MIN_DEPOSIT_USD` | `1` | Optional. Minimum deposit in USD (default `1`). Must match `REACT_APP_MIN_DEPOSIT_USD` on Vercel if you change it. |

If you use NOWPayments, add:

- `NOWPAYMENTS_API_KEY`
- `NOWPAYMENTS_IPN_SECRET`
- `NOWPAYMENTS_CALLBACK_URL` → e.g. `https://smi-api.onrender.com/api/deposit/webhook`
- `NOWPAYMENTS_BASE_CURRENCY`, `NOWPAYMENTS_SANDBOX`, `NOWPAYMENTS_PAY_CURRENCY` as needed.

---

## 4. MongoDB (required)

The server needs a MongoDB database. Use **MongoDB Atlas** (free tier):

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a cluster.
2. Create a database user and get the connection string.
3. In Atlas: **Network Access** → add **0.0.0.0/0** (or Render’s IPs) so Render can connect.
4. Copy the URI (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/SMI?retryWrites=true&w=majority`).
5. Set **MONGO_URI** on Render to this value.

---

## 5. Deploy

Click **"Create Web Service"**. Render will clone the repo, run `npm install` in `server`, and start with `npm start`. Your API will be at:

**https://&lt;your-service-name&gt;.onrender.com**

Test:  
**https://&lt;your-service-name&gt;.onrender.com/api/health**  
should return `{"ok":true}`.

---

## 6. Point the frontend to the API

Your React app on Vercel must call this API URL in production:

1. **Vercel** → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://smi-api.onrender.com/api` (your Render URL **including `/api`**)
   - **Environment:** Production (and Preview if you want).
3. **Redeploy** the Vercel app so the new variable is applied.

The client uses this as the API base (e.g. `.../api/deposit/create`). So the value must end with `/api`.

---

## 7. (Optional) Auth0 allowed origins

In **Auth0** → your Application → **Settings**:

- **Allowed Web Origins:** add `https://smi-trading.vercel.app`
- **Allowed Logout URLs:** add `https://smi-trading.vercel.app`

---

## Summary

| Item | Value |
|------|--------|
| Repo | Navdeep-Singh-Hub/SMI |
| Root Directory | `server` |
| Build | `npm install` (or default) |
| Start | `npm start` |
| API URL | https://&lt;service-name&gt;.onrender.com |
| Frontend env | `REACT_APP_API_URL` = that API URL on Vercel |

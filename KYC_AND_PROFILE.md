# Profile, registration & KYC

## Registration (compulsory fields)

On **Register**, users must enter **username**, **mobile number**, and **address** before continuing to Auth0. Data is stored in `localStorage` and synced to MongoDB on first dashboard load via `PATCH /api/user/profile`.

## Profile (dashboard)

**Profile** in the sidebar shows:

- Email (read-only, from Auth0)
- Editable **username**, **phone**, **address**

A banner appears on the dashboard until phone and address are saved.

## KYC (only for withdrawals)

- Not required to trade or invest.
- **Withdrawals** require `kycStatus === approved` and a complete profile (phone + address).
- User uploads (multipart `POST /api/user/kyc/submit`):
  - `aadhaarFront`, `aadhaarBack`, `panCard`, `holdingPhoto` (JPEG/PNG/WebP, ~6MB each)
- Status: `none` → `pending` → `approved` or `rejected`.

## Admin: approve / reject KYC

Set on Render (or `.env`):

```env
ADMIN_API_KEY=your-long-random-secret
```

```http
POST /api/admin/kyc/decision
Content-Type: application/json
x-admin-key: your-long-random-secret

{ "userId": "<mongodb user _id>", "action": "approve" }
```

Reject:

```json
{ "userId": "<id>", "action": "reject", "reason": "Document unreadable" }
```

## Pre-launch 4× investments

Investments created with `preLaunch: true` (from **Pre-Launch Staking** → Invest) store `preLaunchMultiplier: 4` on the transaction. **Active investments** use this for displayed and computed daily/total earnings.

## Production note (Render)

KYC files are stored under `server/uploads/kyc/` on the instance disk. **Render’s filesystem is ephemeral** — uploads can be lost on redeploy. For production, move to **S3**, **Cloudinary**, or similar persistent storage.

# Auth0 Integration Setup

The app uses Auth0 for login and signup. Configure the following so the **backend** can verify tokens.

## 1. Auth0 Dashboard – Application URLs

In your Auth0 Application settings, set:

- **Application origin:** `http://localhost:3000` (or `http://localhost:5173` if you use that port)
- **Callback URL:** `http://localhost:3000` (or your app origin)
- **Logout URL:** `http://localhost:3000`
- **Web Origin:** `http://localhost:3000`

Use the same origin you use to run the React app (e.g. Create React App default is 3000; Vite often uses 5173).

## 2. Create an API in Auth0 (for backend verification)

So the backend can validate access tokens as JWTs:

1. In Auth0 Dashboard go to **Applications → APIs** and **Create API**.
2. Set **Name** (e.g. "SMI API") and **Identifier** to `https://smi-api`. This identifier is the **audience** and must match the value used in your app (see section 3).
3. Leave signing algorithm as RS256.

## 3. Environment variables

### Client (`client/.env` or env when building)

```env
REACT_APP_AUTH0_DOMAIN=dev-13py8orx1jq30sww.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=NGk6DzO5wtPoasTe4FK9PWmf52T6cACJ
REACT_APP_AUTH0_AUDIENCE=https://smi-api
REACT_APP_API_URL=http://localhost:5000/api
```

Use the same **Identifier** from step 2 for `REACT_APP_AUTH0_AUDIENCE`.  
If you don’t set `REACT_APP_AUTH0_AUDIENCE`, the app still uses Auth0 for login UI, but the backend will not accept the access token (it won’t be a JWT for your API).

### Server (`server/.env`)

```env
AUTH0_DOMAIN=dev-13py8orx1jq30sww.us.auth0.com
AUTH0_AUDIENCE=https://smi-api
```

`AUTH0_AUDIENCE` must match the API **Identifier** you set in Auth0 and the client’s `REACT_APP_AUTH0_AUDIENCE`.

## 4. Flow summary

- **Login / Sign up:** User clicks "Log In with Auth0" or "Sign Up with Auth0" → redirect to Auth0 Universal Login → redirect back to your app.
- **API calls:** The React app gets an access token via `getAccessTokenSilently()` (with audience) and sends it as `Authorization: Bearer <token>`.
- **Backend:** Auth middleware verifies the JWT with Auth0’s JWKS, finds or creates a user by `auth0Id` (sub), and sets `req.userId` for protected routes.

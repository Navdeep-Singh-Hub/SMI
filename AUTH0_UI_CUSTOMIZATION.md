# Customize Auth0 Login & Sign Up Page UI

The login and sign up screens are hosted by **Auth0** (Universal Login). You change their look in the **Auth0 Dashboard**, not in this codebase. Use the steps below to make the Auth0 page match SMI’s dark theme and purple/cyan branding.

---

## 1. Open the theme editor

1. Go to [Auth0 Dashboard](https://manage.auth0.com/).
2. Select your tenant and application if needed.
3. In the left sidebar: **Branding** → **Universal Login**.
4. Open **Customization Options** (or the tab that shows **Colors**, **Fonts**, **Borders**, **Widget**).
5. Ensure you’re using the **New** Universal Login experience (not Classic). If you see “Classic” only, switch to New in **Branding** → **Universal Login** first.

---

## 2. Recommended SMI theme values

Use these so the Auth0 page matches your app (dark background, purple buttons, cyan links).

### Colors

| Element | Hex / value | Notes |
|--------|-------------|--------|
| **Primary button** | `#7c3aed` | Purple (Tailwind purple-600) |
| **Primary button label** | `#ffffff` | White text on button |
| **Links and focused components** | `#67e8f9` | Cyan (Tailwind cyan-300) |
| **Base hover color** | `#6d28d9` | Darker purple on hover |
| **Header** | `#ffffff` | White title |
| **Body text** | `#e5e5e5` or `#a3a3a3` | Light gray |
| **Widget background** | `#18181b` or `#0f0f0f` | Dark (zinc-900 / near black) |
| **Widget border** | `#27272a` or `#3f3f46` | Subtle border (zinc-800) |
| **Input background** | `#27272a` | Dark input background |
| **Input border** | `#3f3f46` | Gray border |
| **Input filled text** | `#ffffff` | White typed text |
| **Input labels and placeholders** | `#a1a1aa` | Gray (zinc-400) |
| **Icons** | `#a1a1aa` | Same as labels |
| **Error** | `#f87171` | Red for errors |
| **Success** | `#4ade80` | Green for success |

### Page background

- Use a **dark background** so it matches your app:
  - **Background color** (if available): `#000000`.
  - Or **Background image**: upload a dark image (e.g. dark gradient or your hero background) and set it in **Page backgrounds**.

### Logo (Widget section)

- **Logo URL**: Host your SMI logo (SVG or PNG) and paste the full URL (e.g. `https://yoursite.com/logo.svg`).
- **Logo position**: Center (or Left/Right if you prefer).
- **Logo height**: e.g. 40–56 px.

### Borders & shape (Borders section)

- **Buttons style**: Rounded corners.
- **Button border radius**: 8–12 px (to match your app’s `rounded-lg`).
- **Inputs style**: Rounded corners.
- **Input border radius**: 8 px.
- **Widget corner radius**: 16–24 px (to match `rounded-2xl`).
- **Widget border weight**: 1 px.
- **Shadow**: On if you want a subtle card effect.

### Fonts (optional)

- To match your app font, use **Fonts** and add a **Font URL** (WOFF with CORS). Then set:
  - **Title** / **Subtitle** / **Body text** / **Button text** / **Input labels** / **Links** to use that font and sizes that match your app.

---

## 3. Save and test

1. Click **Save and Publish** in the theme editor.
2. Use **Try** (or the preview link) to open the login/signup flow in a new tab and confirm it matches SMI.
3. Test from your app: click “Log In with Auth0” or “Sign Up with Auth0” and confirm the Auth0 page looks correct.

---

## 4. Custom text (optional)

To change the **wording** on the Auth0 screens (e.g. “Log in to SMI” instead of “Log in”):

1. In the Dashboard: **Branding** → **Universal Login** → **Advanced Options** (or **Text**).
2. Use **Custom Text** for the prompts you use (e.g. `login`, `signup`) and override the default strings.

---

## 5. Custom domain (optional)

For a fully branded URL (e.g. `login.yourdomain.com` instead of `*.auth0.com`):

1. **Branding** → **Custom Domains**.
2. Add and verify your domain and configure the Auth0 CNAME as instructed.
3. Your Universal Login will then be served from your domain; the same theme still applies.

---

## Summary

- **Where**: Auth0 Dashboard → **Branding** → **Universal Login** → **Customization Options**.
- **What**: Set Colors (primary purple, cyan links, dark widget/inputs), Page background (black/dark), Logo URL, Borders (rounded), and optionally Fonts and Custom Text.
- **Result**: The Auth0 login and sign up page will look aligned with SMI’s UI; your app code does not need to change.

For more detail: [Auth0 – Customize Universal Login themes](https://auth0.com/docs/customize/login-pages/universal-login/customize-themes).

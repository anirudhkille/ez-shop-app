<p align="center">
  <img src="assets/images/icon.png" width="112" alt="EZ Shop app icon" />
</p>

<h1 align="center">EZ Shop</h1>

<p align="center">
  A cross-platform storefront for iOS, Android and the web. Browse the catalogue,
  save favourites, check out with cash on delivery or Stripe, and track your orders.
</p>

<p align="center">
  <img alt="Expo SDK 57" src="https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white" />
  <img alt="React Native 0.86" src="https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Platforms: iOS, Android, Web" src="https://img.shields.io/badge/Platforms-iOS_%7C_Android_%7C_Web-lightgrey" />
</p>

---

## Overview

EZ Shop is an Expo + React Native storefront client for a separately hosted e-commerce
API. It ships a complete shopping flow — authentication, catalogue discovery, product
details, wishlist, cart, checkout and order history — in a dark, orange-accented UI
with custom typography and shared design tokens.

The app runs from a single TypeScript codebase on iOS, Android and the web, uses
Expo Router's typed file-based routes, and keeps server state in TanStack Query.

## Features

### Shopping

- **Home** — promo banner, category grid, featured products and best sellers with
  pull-to-refresh.
- **Shop** — debounced product search, category and department filters, sorting
  (newest, price, rating), and an infinite-scrolling product grid.
- **Product detail** — colour/variant images, size selection, quantity picker,
  discount/tag badges, star ratings, reviews, similar products, wishlist toggle and
  add-to-cart.
- **Wishlist** — saved products in a two-column grid with one-tap removal.
- **Cart** — quantity stepper, line-item removal, discounts, delivery charge and a
  live order summary.

### Checkout and orders

- Three-step checkout: delivery address → delivery method (standard, express or
  same-day) → payment.
- **Cash on delivery** placed directly through the API.
- **Card payment** through a server-created Stripe Checkout session opened in the
  browser.
- Order history with payment/fulfilment statuses and a full order detail screen.

### Account

- Email/password sign-up with a 6-digit email verification code.
- Login, forgot-password and reset-password flows.
- Google sign-in through a browser auth session and the `ezshop://auth/callback`
  deep link.
- Profile editing, saved-address management, password change, newsletter sign-up
  and logout.
- Automatic access-token refresh on `401` responses, with a single shared refresh
  request so parallel failures cannot rotate the token twice.

### Platform and UX

- iOS, Android and web from one codebase.
- Typed Expo Router routes and `@/` path aliases.
- Skeleton loaders, empty states, error states, pull-to-refresh and toast feedback.
- Custom fonts (Barlow Condensed for display, Outfit for body) loaded before the
  splash screen is dismissed.
- Prices displayed in INR (`₹`); all money/date/address formatting lives in
  `lib/format.ts`.

## Tech stack

| Concern        | Choice                                                               |
| -------------- | -------------------------------------------------------------------- |
| Runtime        | Expo SDK 57, React Native 0.86, React 19.2                           |
| Language       | TypeScript (strict)                                                  |
| Navigation     | Expo Router (file-based, typed routes)                               |
| Server state   | TanStack Query v5                                                    |
| Client state   | Zustand with `persist`                                               |
| Forms          | React Hook Form + Zod                                                |
| Networking     | `fetch` wrapper with bearer auth and refresh-token rotation          |
| Secure storage | `expo-secure-store` (falls back to `localStorage` on web)            |
| Media          | `expo-image`, `expo-linear-gradient`, `react-native-svg`             |
| Payments       | Stripe Checkout (hosted page opened with `expo-web-browser`)         |
| Auth provider  | Google OAuth (browser session + deep-link redirect)                  |
| Feedback       | `react-native-toast-message`, custom skeleton/empty-state components |
| Tooling        | ESLint, Prettier, GitHub Actions                                     |

## Requirements

- **Node.js 22** or newer (CI uses Node 22) and npm.
- An **EZ Shop API** instance. This repository contains the Expo client only.
- **Expo Go** for JS-level development, or a **development build** (Android
  Studio/Xcode or EAS) when native configuration matters.
- Optional: an Expo/EAS account for cloud builds and store submissions.

### Expo Go vs. development build

Most UI work runs in Expo Go. The project includes config plugins for
`@stripe/stripe-react-native` and `@react-native-google-signin/google-signin`; if you
change native configuration or add native code, use a development build. The current
payment and Google flows open hosted pages in the browser, so they do not require the
native Stripe or Google SDKs at runtime.

## Getting started

### 1. Install dependencies

```bash
npm install
```

Use `npm ci` if you want an exact install from `package-lock.json`.

### 2. Configure the API URL

Create a `.env` file in the project root:

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:7777/api
```

`EXPO_PUBLIC_API_URL` must be the full API base URL, including the `/api` suffix.
The preview and production EAS profiles use:

```text
https://ez-shop-server.onrender.com/api
```

Notes:

- `.env` is git-ignored. Only `EXPO_PUBLIC_*` variables are exposed to the app —
  **never put secrets in them**, because they are embedded in the client bundle.
- When the configured URL points at `localhost` or `127.0.0.1`, `api/client.ts`
  rewrites the host to the machine running Metro. That lets a physical device reach a
  local server over the LAN, as long as both are on the same network.
- If the API is hosted elsewhere, use its public URL (or your machine's LAN IP)
  instead of `localhost`.

### 3. Start the app

```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for web. You can also launch a target
directly:

```bash
npm run android
npm run ios
npm run web
```

### Environment variables

| Variable              | Required | Description                                    |
| --------------------- | :------: | ---------------------------------------------- |
| `EXPO_PUBLIC_API_URL` |   Yes    | Base URL of the EZ Shop API, including `/api`. |

EAS injects this variable per build profile (see `eas.json`).

## Available scripts

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm start`            | Start the Expo dev server.                |
| `npm run android`      | Start Expo and open the Android target.   |
| `npm run ios`          | Start Expo and open the iOS target.       |
| `npm run web`          | Start the web build in the browser.       |
| `npm run lint`         | Run ESLint via `expo lint`.               |
| `npm run typecheck`    | Run `tsc --noEmit` across the project.    |
| `npm run format`       | Format the repository with Prettier.      |
| `npm run format:check` | Check formatting without writing changes. |

There is currently no automated test script or test suite configured.

## Project structure

```text
.
├── app/                          # Expo Router routes
│   ├── _layout.tsx               # Providers, fonts, splash, auth guard
│   ├── index.tsx                 # Entry redirect (home or login)
│   ├── (tabs)/                   # home, shop, wishlist, cart, profile
│   ├── product/[slug]/[id].tsx   # Product detail
│   ├── category/[id].tsx         # Category listing
│   ├── profile/                  # Account, addresses, orders, password
│   └── login.tsx, signup.tsx,    # Public auth flow
│       verify-otp.tsx, ...
├── api/                          # Typed REST wrappers, one file per domain
│   └── client.ts                 # Base URL, auth header, refresh, errors
├── hooks/                        # TanStack Query hooks per domain
├── store/auth.ts                 # Zustand session store (persisted refresh token)
├── components/
│   ├── ui/                       # Design-system primitives
│   └── shared/                   # Product card, promo banner, sheet
├── layout/                       # Containers, headers, auth layout
├── constant/color.ts             # Colours, fonts, radii
├── lib/                          # Formatting helpers and toast config
├── types/api.ts                  # API models and response envelopes
├── assets/                       # Icons, fonts, images
└── .github/workflows/ci.yml      # Lint and type-check pipeline
```

`android/` and `ios/` are generated by prebuild/EAS and are intentionally git-ignored.
Do not commit them; EAS regenerates the native project on each build.

## Architecture

### Data flow

```text
Screen  →  hook (hooks/useProducts.ts)  →  API wrapper (api/products.ts)
        →  apiClient (api/client.ts)     →  EZ Shop REST API
```

- Screens never call `fetch` directly.
- TanStack Query owns remote data, caching and invalidation. Queries default to a
  60-second `staleTime` and two retries; authentication errors are not retried.
- Zustand owns the session. The access token is kept in memory only; the refresh token
  and user profile are persisted with `expo-secure-store` (or `localStorage` on web).
- Mutations invalidate the query keys they affect (for example, cart mutations
  invalidate `["cart"]`).

### Authentication and route protection

1. Login/sign-up verification returns an access token and a refresh token.
2. `apiClient` attaches `Authorization: Bearer <accessToken>` to authenticated calls.
3. On a `401`, it runs one shared refresh request against
   `POST /user/refresh-token`, stores the rotated token, and replays the failed
   request once.
4. If refresh fails, the session is cleared and the root layout redirects to `/login`.
5. Public routes are declared in `PUBLIC_ROUTES` in `app/_layout.tsx`. Every other
   route requires a session. The guard waits for persisted auth state to hydrate before
   redirecting, so it never acts on an empty token during the first render.
6. Google sign-in opens `${EXPO_PUBLIC_API_URL}/user/google` in a browser auth session
   and returns to the app through `ezshop://auth/callback`.

### API conventions

Most responses use a consistent envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

Authenticated endpoints expect a bearer access token. Product filtering accepts
pagination (`page`, `limit`), `category` (an ObjectId), `gender` and `sort`. Prices are
displayed in INR.

| Area       | Endpoints used by the client                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth       | `POST /user/signup`, `POST /user/verify-signup-otp`, `POST /user/login`, `POST /user/logout`, `POST /user/refresh-token`, `POST /user/forgot-password`, `PUT /user/reset-password` |
| Google     | `GET /user/google`, `POST /user/google/mobile`                                                                                                                                     |
| Profile    | `GET /user/profile`, `PATCH /user`, `PUT /user/password`                                                                                                                           |
| Catalogue  | `GET /category`, `GET /product/:slug/:id`, `GET /product/filter`, `GET /product/search`, `GET /product/featured`, `GET /product/best-sellers`, `GET /product/similar/:id`          |
| Reviews    | `GET /review/:productId`                                                                                                                                                           |
| Cart       | `GET /cart`, `POST /cart`, `PUT /cart`, `DELETE /cart/:cartItemId`, `DELETE /cart/clear`, `GET /cart/count`                                                                        |
| Wishlist   | `GET /wishlist`, `GET /wishlist/details`, `POST /wishlist/toggle`                                                                                                                  |
| Addresses  | `GET /address`, `POST /address`, `PATCH /address/:id`, `DELETE /address/:id`                                                                                                       |
| Orders     | `POST /order/cod`, `GET /order/my-orders`, `GET /order/order-id/:id`                                                                                                               |
| Payments   | `POST /payment/create-checkout-session`                                                                                                                                            |
| Newsletter | `POST /newsletter`                                                                                                                                                                 |

## Code quality and CI

```bash
npm run lint
npm run typecheck
npm run format:check
```

GitHub Actions runs lint and TypeScript checks on pushes to `main` and `develop`, and
on pull requests targeting `main` (`.github/workflows/ci.yml`).

## Building and releasing

Builds are managed with EAS using the profiles in `eas.json`:

| Profile       | Distribution | Output     | API URL                                   |
| ------------- | ------------ | ---------- | ----------------------------------------- |
| `development` | Internal     | APK        | `http://localhost:7777/api`               |
| `preview`     | Internal     | APK        | `https://ez-shop-server.onrender.com/api` |
| `production`  | Store        | App bundle | `https://ez-shop-server.onrender.com/api` |

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile preview --platform android
npx eas-cli@latest build --profile production --platform all
npx eas-cli@latest submit --profile production --platform all
```

App versions are sourced locally (`appVersionSource: "local"`), so bump `expo.version`
in `app.json` before a store build. Bundle identifiers are
`com.anirudhkille.ezshopapp` on both platforms, and the deep-link scheme is `ezshop`.

## Conventions for contributors

- Add a function to `api/<domain>.ts`, then wrap it in a hook in `hooks/`. Keep query
  keys consistent and invalidate affected keys after mutations.
- Import through the `@/` alias, for example `@/components/ui/Button`.
- Use `components/ui` primitives and tokens from `constant/color.ts` instead of
  hardcoding colours, fonts, spacing or radii.
- Format money, dates and addresses with the helpers in `lib/format.ts`.
- If you add an unauthenticated screen, add its route to `PUBLIC_ROUTES` in
  `app/_layout.tsx`; otherwise the auth guard will redirect it to `/login`.
- Run `npm run lint`, `npm run typecheck` and `npm run format:check` before opening a
  pull request.

## Troubleshooting

| Symptom                                 | Likely fix                                                                                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| “Cannot reach the API at …”             | Check that the server is running, `EXPO_PUBLIC_API_URL` includes `/api`, and the device can reach the host.                                    |
| Requests work on web but not on a phone | Make sure both devices are on the same network and the API binds to `0.0.0.0`. A `localhost` URL is rewritten to the Metro host automatically. |
| App redirects to login repeatedly       | The session is gone or the refresh token is expired/revoked. Sign in again; on web, clear the stored `auth-session` entry in local storage.    |
| Blank screen while starting             | Check Metro logs for font-loading or hydration errors, then reinstall dependencies and clear the cache.                                        |
| Expo Go complains about a native module | Use a development build (`npx expo run:android`, `npx expo run:ios`, or an EAS `development` build).                                           |
| Stale bundle or Metro cache             | Run `npx expo start -c` and delete the `.expo/` directory.                                                                                     |
| Google sign-in returns without a token  | Confirm the API redirects to `ezshop://auth/callback` and that the scheme is registered in the Google OAuth configuration.                     |
| Stripe payment leaves the order pending | Payment confirmation is handled server-side (Stripe webhook). Verify the API's Stripe keys and webhook configuration.                          |

## License

No license file is included in this repository. All rights are reserved unless a
license is added.

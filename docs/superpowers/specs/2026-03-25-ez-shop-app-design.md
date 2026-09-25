# Design Spec: EZ-Shop Mobile App & Expo 57 Upgrade

## Overview
This specification outlines the updates for the `ez-shop-app` (Expo React Native mobile app) to:
1. Upgrade to the latest Expo SDK 57.
2. Implement missing pages/screens corresponding to the backend API (`ez-shop/server`):
   - Search results & Product Filtering screen (`app/search.tsx`)
   - Category products screen (`app/category/[id].tsx`)
   - Checkout flow (`app/checkout.tsx`)
   - Payment WebView & Order Success screens (`app/payment-webview.tsx`, `app/order-success.tsx`)
3. Adopt the exact styling, color scheme, and typography tokens from `ez-shop-client` (web React client with vibrant orange brand accents, sleek dark mode surface colors, and typography).

---

## 1. Styling & Theming (`constant/color.ts`)
Update color tokens to match `ez-shop-client`:
- **Primary / Accent**: Vibrant Orange (`#FF5500` / `hsl(22, 100%, 52%)`)
- **Dark Background**: `#0D0D0D` (or `#050505`)
- **Card / Surface**: `#141414` / `#1A1A1A`
- **Border**: `#262626` / `#333333`
- **Text Foreground**: `#F5F5F5` (muted `#8C8C8C`)

---

## 2. New Pages & Features
- **Search (`app/search.tsx`)**: Real-time search query input against backend `/products/search` or `/products/filter`, sort options, and responsive product grid.
- **Category Browsing (`app/category/[id].tsx`)**: Fetching and displaying products belonging to a specific category ID.
- **Checkout (`app/checkout.tsx`)**: Address selection, order summary breakdown, and payment choice (COD vs Online Stripe).
- **Payment & Order Success (`app/payment-webview.tsx` & `app/order-success.tsx`)**: Secure webview for Stripe checkout redirection and success celebration screen.

---

## 3. Expo SDK 57 Upgrade
- Update all Expo packages, `react-native`, `react-native-safe-area-context`, `expo-router`, etc., to their respective latest 57.x / compatible versions in `package.json`.
- Run dependency resolution and fix any deprecated component usages.

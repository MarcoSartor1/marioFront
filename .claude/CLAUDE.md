# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Teslo Shop is a **Next.js 14 frontend** that acts as a BFF (Backend For Frontend) on top of a **separate NestJS backend API**. The frontend does not own the database directly — all business logic, data persistence, and payment processing live in the NestJS API. The Next.js layer handles SSR, NextAuth sessions, server actions, and UI.

Stack: Next.js 14 (App Router), TypeScript, NextAuth v5, Zustand, Tailwind CSS, MercadoPago.

## Development Commands

```bash
npm run dev              # Start Next.js dev server
npm run dev:turbo        # Start with Turbo mode
npm run build            # Build for production
npm run lint             # Run Next.js linter
```

### Required environment variables
- `API_URL` — Base URL of the NestJS backend (e.g. `http://localhost:3001/api`)
- `AUTH_SECRET` — NextAuth secret (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — Public URL of this frontend

## Architecture

### Backend API Integration

All server actions call the NestJS backend via `src/lib/api.ts`:
- `apiFetch(path, options)` — authenticated fetch; reads JWT token from NextAuth session and adds `Authorization: Bearer <token>` header automatically
- Helpers: `apiGet`, `apiPost`, `apiPatch`, `apiDelete`
- Auth: login/register delegate to `POST /auth/login` and `/auth/register` on the backend; the backend returns `{ id, name, email, role, token }` and the JWT is stored in the NextAuth session token
- The backend token is accessed via `(session.user as any).token`

### Directory Structure

**`src/actions/`** - Server Actions organized by domain: `address/`, `auth/`, `order/`, `product/`, `user/`, `payments/`, `category/`, `config/`
- All re-exported from `src/actions/index.ts`
- Return `{ ok: boolean, message?: string, data? }` shape consistently

**`src/app/`** - Next.js App Router
- `(shop)/` - Main shop pages (products, cart, checkout, orders, profile)
- `(shop)/admin/` - Admin panel (products, orders, users, categories, bulk-upload)
- `auth/` - Login and register pages
- `api/products/bulk-upload/` - File upload API route

**`src/lib/api.ts`** - Authenticated HTTP client for backend calls (see above)

**`src/store/`** - Zustand stores: `cart/`, `address/`, `ui/` — all re-exported from `src/store/index.ts`

### Key Architectural Patterns

**Payment Methods**
- **MercadoPago**: `createMpPreference` calls backend `POST /payment/create-preference/:orderId`; result pages at `/orders/[id]/success|failure|pending`
- **Transfer (manual)**: Order placed with `paymentMethod: transfer`; admin uploads receipt; `paymentReceipt` field stores the image URL

**SaaS / White-label**
- `StoreConfig` model (single-row) holds store name, logo, colors, bank transfer details, shipping info
- Fetched via `getStoreConfig()` which calls `GET /config` with 60s ISR revalidation; falls back to defaults if API unavailable

**Categories**
- Dynamic, admin-managed via `src/app/(shop)/admin/categories/` and `src/app/(shop)/admin/category/[id]/`
- Products can be browsed by category slug at `/category/[category]`

**Products**
- `gender` and `sizes` fields are optional to support non-clothing products
- Bulk upload available at `/admin/products/bulk-upload`

### Important Notes

**Authentication**
- NextAuth v5 (beta) in `src/auth.config.ts`; credentials provider delegates to NestJS `/auth/login`
- The backend JWT is stored in the session token and forwarded by `apiFetch` automatically
- User roles (`admin`/`user`) come from the backend response; admin routes check `session.user.role`

**State Management**
- Zustand for cart (persisted to localStorage) and UI state
- Clear localStorage when developing to avoid stale state

**Styling**
- Tailwind CSS; custom fonts in `src/config/fonts.ts`; global styles in `src/app/globals.css`

**Image Handling**
- Cloudinary for product image uploads

**Order Status Flow**
- `pending` → `processing` → `paid` → `shipped` → `delivered` (or `cancelled`)
- Admin can update status via `updateOrderStatus` action; MercadoPago callbacks update automatically

### Testing Changes

1. For auth changes: clear browser cookies and localStorage; ensure NestJS backend is running
2. For cart/checkout: clear localStorage and test full flow
3. For MercadoPago: use sandbox credentials; result pages handle success/failure/pending
4. For admin features: ensure the user returned by backend has `role: "admin"`
5. For StoreConfig: changes reflect after 60s ISR revalidation (or redeploy)

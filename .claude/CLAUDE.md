# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Teslo Shop is an e-commerce application built with Next.js 14 (App Router), TypeScript, Prisma ORM, PostgreSQL, and NextAuth v5. It features product management, shopping cart, checkout flow, PayPal integration, and admin panel with role-based access control.

## Development Commands

### Initial Setup
```bash
# 1. Clone and install dependencies
npm install

# 2. Setup environment variables
# Copy .env.template to .env and configure:
# - Database credentials (DB_USER, DB_NAME, DB_PASSWORD)
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - PayPal credentials (NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_SECRET)
# - Cloudinary URL (CLOUDINARY_URL)

# 3. Start PostgreSQL database (Docker)
docker compose up -d

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed the database with initial data
npm run seed

# 6. Clear browser localStorage before running

# 7. Start development server
npm run dev
# Or with Turbo mode:
npm run dev:turbo
```

### Common Commands
```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:turbo        # Start with Turbo mode

# Database
npx prisma migrate dev   # Create and apply migrations
npx prisma generate      # Generate Prisma Client
npx prisma studio        # Open Prisma Studio GUI
npm run prisma:deploy    # Deploy migrations and generate client
npm run seed             # Seed database with initial data

# Build & Deploy
npm run build            # Build for production (includes prisma:deploy)
npm start                # Start production server

# Linting
npm run lint             # Run Next.js linter
```

## Architecture

### Directory Structure

**`src/actions/`** - Server Actions (Next.js Server Actions pattern)
- Organized by domain: `address/`, `auth/`, `order/`, `product/`, `user/`, `payments/`
- All actions are re-exported from `src/actions/index.ts`
- Server-side business logic and database operations
- Use Zod for validation and return standardized response objects

**`src/app/`** - Next.js App Router
- `(shop)/` - Route group for main shop pages (products, cart, checkout, orders)
- `(shop)/admin/` - Admin panel routes (products, orders, users management)
- `auth/` - Authentication routes (login, register)
- `api/` - API routes (likely PayPal webhooks)

**`src/components/`** - React Components
- Organized by feature/domain (ui, product, orders, paypal, providers)
- Re-exported from `src/components/index.ts`

**`src/store/`** - Zustand State Management
- `cart/` - Shopping cart state
- `address/` - Address form state
- `ui/` - UI state (sidebar, modals)
- All stores re-exported from `src/store/index.ts`

**`src/lib/`** - Utilities and configurations
- `prisma.ts` - Prisma client singleton

**`prisma/schema.prisma`** - Database Schema
- Models: User, Product, Category, Order, OrderItem, OrderAddress, UserAddress, Country
- Enums: Role (admin/user), Gender (men/women/kid/unisex), Size (XS-XXXL)

### Key Architectural Patterns

**Server Actions Pattern**
- All data mutations and fetches use Next.js Server Actions in `src/actions/`
- Server Actions handle authentication checks, database operations, and business logic
- Called directly from components using `'use server'` directive

**Authentication**
- NextAuth v5 (beta) configured in `src/auth.config.ts`
- Credentials provider with bcryptjs password hashing
- JWT-based sessions with custom callbacks
- User roles (admin/user) control access to admin routes

**Database Access**
- Prisma ORM with PostgreSQL
- Singleton Prisma client pattern (avoid multiple instances in dev)
- Migrations stored in `prisma/migrations/`
- Always run `prisma generate` after schema changes

**State Management**
- Zustand for client-side state (cart, UI state)
- Server state fetched via Server Actions
- Persist cart state to localStorage

**Styling**
- Tailwind CSS configured globally
- Custom fonts defined in `src/config/fonts.ts`
- Global styles in `src/app/globals.css`

**Image Handling**
- Cloudinary for image uploads and storage
- Next.js Image component configured for `res.cloudinary.com` domain
- ProductImage model stores image URLs

**Payment Processing**
- PayPal integration via `@paypal/react-paypal-js`
- Server-side payment verification in `src/actions/payments/`
- Transaction IDs stored on Order model

### Important Notes

**Database Migrations**
- Before modifying Prisma schema, ensure database is running
- After schema changes: `npx prisma migrate dev` (creates migration) or `npx prisma db push` (direct schema sync)
- Production builds automatically run `prisma:deploy` to apply migrations

**Environment Variables**
- Never commit `.env` file (use `.env.template` as reference)
- AUTH_SECRET is required for NextAuth sessions
- Database URL format: `postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public`

**Seeding**
- Seed script located in `src/seed/seed-database.ts`
- Run with `npm run seed` to populate initial data
- Typically includes categories, products, and test users

**localStorage Usage**
- Cart state persists to localStorage
- Clear localStorage when developing to avoid stale state issues

**Route Groups**
- `(shop)` route group shares common layout for main shop pages
- `(checkout)` nested route group within checkout flow
- Admin routes are inside `(shop)/admin/` for consistent navigation

### Testing Changes

When making changes:
1. For schema changes: `npx prisma migrate dev` → `npm run seed` (if needed) → restart dev server
2. For auth changes: Clear browser cookies and localStorage
3. For cart/checkout: Clear localStorage and test full flow
4. For PayPal: Use sandbox credentials and test orders
5. For admin features: Ensure user has `admin` role in database

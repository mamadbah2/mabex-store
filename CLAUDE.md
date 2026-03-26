# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mabex Store is a B2B/B2C e-commerce platform built for the Guinean market. It supports three user roles (customer, seller, admin) and features a tiered pricing system where unit price decreases with quantity.

## Commands

```bash
npm run dev        # Development server at http://localhost:3000
npm run build      # Production build (ESLint & TS errors are ignored in build config)
npm run start      # Production server
npm run lint       # ESLint
npm run seed       # Seed database with demo data (tsx scripts/seed.ts)
```

### Demo accounts (after seeding)
- Admin: admin@guineeshop.com / admin123
- Seller: vendeur@guineeshop.com / vendeur123
- Customer: client@guineeshop.com / client123

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + MongoDB/Mongoose + Supabase (image storage)

### API layer
- RESTful route handlers in `app/api/`. Public routes under `/api/products`, `/api/orders`, `/api/auth`. Role-gated routes under `/api/seller/*` (seller or admin) and `/api/admin/*` (admin only).
- API routes validate input with Zod schemas, then interact with Mongoose models defined in `lib/models.ts`.
- Responses follow `{ data/error, message?, status }` shape.

### Authentication
- JWT (7-day expiry) stored in an httpOnly cookie (`authToken`) + localStorage for client-side reads.
- `lib/auth.ts` handles login/register/token generation. Passwords hashed with bcryptjs (12 rounds).
- `middleware.ts` protects `/admin/*` and `/seller/*` pages by decoding the JWT payload (base64, no verification) and checking `role`.
- API routes verify tokens server-side via `lib/auth.ts`.

### Data models (`lib/models.ts` + `lib/types.ts`)
- **User**: email, password, firstName, lastName, role (`customer | seller | admin`), isActive
- **Product**: name, description, category, stock, `priceTiers[]` (tiered pricing), images (Supabase URLs), sellerId
- **Order**: userId, items[], totalAmount, status (`pending | preparing | confirmed`), shippingAddress, phone

### Tiered pricing
Products use `priceTiers: { minQuantity, maxQuantity?, price }[]`. Price calculation logic is in `lib/utils.ts:calculateProductPrice()`.

### Cart (client-side)
React Context + useReducer in `lib/cart-context.tsx`, persisted to localStorage. Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART, LOAD_CART.

### Image storage
Supabase bucket `products-pictures`, path pattern: `sellers/{sellerId}/{timestamp}-{hash}.{ext}`. Upload/delete functions in `lib/supabase.ts`. See `SUPABASE_SETUP.md` for RLS policies.

### UI components
Uses shadcn/ui (new-york style) with Radix UI primitives. Config in `components.json`. Add new components with `npx shadcn@latest add <component>`. Custom components live alongside in `components/`.

## Path aliases

`@/*` maps to the project root (configured in tsconfig.json). Use `@/lib/...`, `@/components/...`, `@/hooks/...`.

## Environment variables

Required in `.env.local`:
```
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
JWT_SECRET=...          # optional, has a fallback
```

## Language

The codebase uses French for UI text, code comments, and documentation. Variable/function names are in English.

# Skill: Auth & Payments (NextAuth & Mercado Pago)

## Authentication
- Provider: NextAuth v5 (beta).
- Config: `src/auth.config.ts`.
- Strategy: Credentials (bcryptjs) + JWT sessions.
- Roles: `admin` for /admin routes, `user` for standard shop.

## Payments (Core)
- **Primary Gateway**: Mercado Pago (SDK / Checkout Pro).
- **Manual Payment**: Bank Transfer (Transferencia Bancaria).
- **Logic**:
  - Orders stay as "Pending" until Mercado Pago webhook confirms or Admin manually approves Transfer.
  - Receipt Upload: (Optional) Users can upload a screenshot of the transfer.

## Order Tracking
- Payment Status: [PAID, PENDING, CANCELLED].
- Transaction IDs: Store Mercado Pago `payment_id` or Transfer Reference.
- Backend Verification: Actions in `src/actions/payments/`.
# Skill: Data Layer (Prisma & Postgres)

## Models & Relations
- Core Models: User, Product, Category, Order, OrderItem, OrderAddress, UserAddress, Country.
- Key Enums: Role (admin/user), Gender, Size.

## Procedures
- Client: Singleton pattern in `src/lib/prisma.ts`.
- Changes: Modify `schema.prisma` -> `npx prisma migrate dev` -> `npm run seed`.
- Seeding: Script in `src/seed/seed-database.ts`.

## Rules
- Always use Prisma Client for DB operations.
- Ensure `prisma generate` is run after schema updates.
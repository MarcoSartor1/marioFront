# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start:dev          # Start development server with watch mode
yarn build              # Build for production
yarn start:prod         # Run production build

yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run end-to-end tests

yarn lint               # ESLint with auto-fix
yarn format             # Prettier formatting
```

Run a single test file:
```bash
yarn test -- --testPathPattern=products.service
```

## Setup

1. Copy `.env.template` to `.env` and fill in values
2. Start PostgreSQL + pgAdmin: `docker-compose up -d`
3. `yarn start:dev`

The app listens on **port 3001** with global prefix `/api` (e.g., `http://localhost:3001/api/products`).

## Architecture

**NestJS + TypeORM + PostgreSQL** backend (project name: teslo-shop).

- `src/app.module.ts` — Root module; wires `ConfigModule`, `TypeOrmModule`, and feature modules
- `src/main.ts` — Bootstrap: global prefix `api`, `ValidationPipe` (whitelist + forbidNonWhitelisted)
- Feature modules live under `src/<feature>/` with the standard NestJS structure: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `entities/`, `dto/`

### Database

TypeORM with PostgreSQL. `synchronize: true` is active — schema changes in entities are auto-applied on startup (dev only). Entity lifecycle hooks handle slug generation (`@BeforeInsert`, `@BeforeUpdate`).

### Modules


| Module | Responsibility |
|--------|---------------|
| `ProductsModule` | Full CRUD for products (UUID PK, slug auto-gen, sizes/tags as arrays) |
| `CommonModule` | Shared DTOs (e.g., `PaginationDto`) |

### Validation

Class-validator decorators on DTOs. `whitelist: true` strips unknown properties; `forbidNonWhitelisted: true` throws on unexpected fields.

### Planned (not yet implemented)

- JWT authentication (`JWT_SECRET` is in `.env.template` but no auth guard/module exists yet)

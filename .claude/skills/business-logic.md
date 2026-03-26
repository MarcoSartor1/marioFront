# Skill: Business Logic (Server Actions)

## Structure
- Path: `src/actions/[domain]/`.
- Export: All actions must be re-exported in `src/actions/index.ts`.

## Patterns
- Validation: Use **Zod** for all input validation.
- Security: Check authentication and roles inside each action.
- Responses: Return standardized objects (e.g., `{ ok: boolean, message?: string, data?: T }`).
- Directives: Always start with `'use server'`.
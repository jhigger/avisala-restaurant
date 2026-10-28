# 01 — Database Profile Model & Role Migration

## Parent

#12

## What to build

Add a `Profile` model and `UserRole` enum (`CUSTOMER`, `ADMIN`) to `prisma/schema.prisma`. The `Profile.id` maps directly to Supabase's `auth.users.id` (UUID). Create a Prisma migration and update `prisma/seed.ts` to include default profile definitions (including a seeded administrator account placeholder).

## Acceptance criteria

- [ ] `UserRole` enum (`CUSTOMER`, `ADMIN`) added to `prisma/schema.prisma`.
- [ ] `Profile` model added to `prisma/schema.prisma` with fields: `id` (String `@id`), `email` (String `@unique`), `fullName` (String?), `role` (UserRole `@default(CUSTOMER)`), `kingdom` (Kingdom `@default(GENERAL)`), `createdAt`, and `updatedAt`.
- [ ] A migration is created in `prisma/migrations/` applying the table and enum changes cleanly.
- [ ] `prisma/seed.ts` is updated to optionally seed or handle an admin profile.
- [ ] `pnpm check` and Prisma generation succeed without type errors.

## Blocked by

- None — can start immediately.

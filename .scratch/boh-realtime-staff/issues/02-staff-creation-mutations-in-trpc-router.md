# 02 — Staff Creation & Management Mutations in tRPC Router

## Parent

#22

## What to build

Add `createStaff` mutation to `src/server/api/routers/staff.ts`. Validate input fields using Zod: `fullName` (min 2), `title` (min 2), `kingdomAffinity` (`Kingdom`), `role` (`StaffRole`), `contact` (min 5), and optional `avatarUrl`. Create the staff member record in the database and return it. Optionally implement `deleteStaff` with safety checks against active shifts.

## Acceptance criteria

- [ ] `createStaff` mutation is implemented on `staffRouter` with full Zod input validation.
- [ ] Successfully creates a staff record in `ctx.db.staff` with assigned `StaffRole` and `Kingdom`.
- [ ] Returns the created `Staff` record including its schema fields.
- [ ] Zod schema rejects invalid roles, non-existent kingdoms, or blank contact information with structured validation errors.
- [ ] `pnpm check` passes without type errors.

## Blocked by

- None — can start immediately.

# 05 — End-to-End Staff Seam Verification & Concurrency Tests

## Parent

#22

## What to build

Create automated integration tests in `tests/staff-seam.test.ts` verifying the end-to-end staff lifecycle at the tRPC seam. Test creating staff members, scheduling shifts for newly created staff, preventing overlapping shift assignments on the same day/time, validating enum integrity, and ensuring that real-time invalidations cleanly tear down without memory leaks.

## Acceptance criteria

- [ ] `tests/staff-seam.test.ts` is implemented and integrated with the test runner (`pnpm test`).
- [ ] Tests verify `createStaff` inserts records with valid Prisma model attributes.
- [ ] Tests verify input validation for edge cases (short names, invalid enums, empty contacts).
- [ ] Tests verify creating shifts against newly created staff members respects shift overlap conflict detection.
- [ ] Tests verify clean database teardown and isolation.
- [ ] `pnpm check` and `pnpm test` pass with 0 errors.

## Blocked by

- #26 — Admin Staff UI: Add Staff Dialog & Live Roster Sync

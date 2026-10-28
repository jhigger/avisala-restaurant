# 05 — Router RBAC Migration & Auth Integration Tests

## Parent

#12

## What to build

Migrate sensitive backend procedures across tRPC routers to enforce role-based access control. Protect administrative procedures in `inventoryRouter`, `staffRouter`, `tableRouter`, and `orderRouter` (`updateStatus`, `getAll`) with `adminProcedure`. Protect customer profile and personal order operations with `protectedProcedure`. Add comprehensive integration tests at the tRPC seam verifying that unauthorized calls fail with appropriate status codes and authorized calls succeed.

## Acceptance criteria

- [ ] `inventoryRouter` mutations (`updateStock`, `create`, `delete`) and sensitive queries use `adminProcedure`.
- [ ] `staffRouter` procedures use `adminProcedure`.
- [ ] `tableRouter` management procedures use `adminProcedure`.
- [ ] `orderRouter.updateStatus` and `orderRouter.getAll` use `adminProcedure`.
- [ ] Unauthenticated callers receive `401 UNAUTHORIZED` on protected endpoints.
- [ ] Authenticated non-admin callers receive `403 FORBIDDEN` when calling admin endpoints.
- [ ] Automated tests in `tests/auth-seam.test.ts` verify all access tiers (public, protected, admin) and passing test suite.

## Blocked by

- #16 — Auth UI Flows (Login, Register & Role-Aware Navigation)

# 03 — Server API Routers Decimal Arithmetic & Enum Alignment

## Parent

#1

## What to build

Align the server-side tRPC API procedures with the new schema types. Ensure monetary calculations properly handle exact decimal numbers when creating orders, computing tax and subtotals, and replenishing inventory. Update input validation to align with domain enums, ensuring all backend procedures typecheck cleanly.

## Acceptance criteria

- [ ] Order creation procedure computes subtotals, tax rates, delivery fees, and line item costs accurately with decimal data types.
- [ ] Inventory replenishment procedure correctly updates ingredient stock amounts and unit costs without precision errors.
- [ ] Menu, reservation, and staff query procedures filter accurately using the new domain enum definitions.
- [ ] All tRPC input validation schemas align with the generated domain enums.
- [ ] Codebase passes full TypeScript typechecking and lint checks.

## Blocked by

- #3 (02 — Prisma PostgreSQL Schema, Initial Migration & Seed)

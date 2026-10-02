# 04 — End-to-End Verification at the tRPC Seam

## Parent

#1

## What to build

Verify end-to-end behavior at the primary testing seam (`appRouter.createCaller`). Build and execute automated test coverage verifying that all domain operations (fetching kingdom menus, placing orders with exact decimal sums, updating pantry inventory, and booking realm dining tables) execute successfully against the live Supabase PostgreSQL database.

## Acceptance criteria

- [ ] Integration test suite executes against the live Supabase PostgreSQL instance via the tRPC caller seam.
- [ ] Test verifies querying menu items filtered by kingdom and category.
- [ ] Test verifies order creation computes exact line item totals, tax, and delivery fee without floating-point errors.
- [ ] Test verifies inventory stock deduction occurs when an order is placed.
- [ ] Test verifies table booking succeeds with valid realm preference and assigns confirmed status.
- [ ] All tests pass cleanly in automated test runs.

## Blocked by

- #4 (03 — Server API Routers Decimal Arithmetic & Enum Alignment)

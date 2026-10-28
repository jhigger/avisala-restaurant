# 03 — Concurrent Optimistic Updates & Automated Seam Verification Tests

## Parent

#18

## What to build

Ensure that simultaneous optimistic updates and query cache invalidations do not produce race conditions or overwrite each other when multiple orders transition in parallel. Create comprehensive automated integration tests in `tests/kds-async-fulfillment.test.ts` verifying that multiple orders can be advanced in parallel, per-order pending flags behave independently, and error rollbacks are scoped strictly to the failing order.

## Acceptance criteria

- [ ] Optimistic cache updater correctly preserves non-conflicting concurrent mutations across `utils.order.getAll`.
- [ ] If a mutation for Order A fails while Order B succeeds, only Order A reverts to its original status.
- [ ] Automated integration tests in `tests/kds-async-fulfillment.test.ts` pass, testing:
  - Concurrent `advanceStatus` executions on distinct order IDs.
  - Granular pending flag independence (`isOrderPending(A)` vs `isOrderPending(B)`).
  - Isolated rollback on single failure.
- [ ] `pnpm check` and `pnpm test` pass with 0 errors.

## Blocked by

- #20 — Fulfillment Board UI Granular Non-Blocking Button States

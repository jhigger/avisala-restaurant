# 01 — Per-Order Transition State Hook & Concurrency Seam

## Parent

#18

## What to build

Create a dedicated domain hook `useKDSOrderActions()` in `src/hooks/use-kds-order-actions.ts` that manages order fulfillment transitions with granular per-order pending tracking. Instead of relying on a single global `isPending` boolean, maintain a set or map of active transition IDs (`pendingOrderIds: Set<string>`), enabling concurrent status updates across multiple orders without blocking one another.

## Acceptance criteria

- [ ] `src/hooks/use-kds-order-actions.ts` is created and exports `useKDSOrderActions()`.
- [ ] Hook provides `advanceStatus(orderId: string, currentStatus: OrderStatus): Promise<void>`.
- [ ] Hook provides `isOrderPending(orderId: string): boolean`, returning `true` only for orders actively in transit.
- [ ] Multiple calls to `advanceStatus` for different order IDs can run concurrently without blocking.
- [ ] `onMutate`, `onError`, and `onSettled` properly manage per-order state in `pendingOrderIds`.
- [ ] Unit tests verify that transitioning Order A sets `isOrderPending(A) === true` while `isOrderPending(B) === false`.

## Blocked by

- None — can start immediately.

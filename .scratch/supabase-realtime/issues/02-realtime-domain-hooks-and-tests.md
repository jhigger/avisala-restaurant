# 02 — Realtime Domain Hooks & Lifecycle Tests

## Parent

#6

## What to build

Implement dedicated React hooks in `src/hooks/use-order-realtime.ts` that encapsulate Supabase Realtime channel subscriptions, server-side filtering, tRPC React Query cache invalidation, and proper teardown on unmount. Add automated unit/integration tests verifying hook behavior and cleanup.

## Acceptance criteria

- [ ] `useOrderRealtime(orderId)` creates a scoped channel on `public:Order` with `id=eq.${orderId}` listening to `UPDATE` events.
- [ ] On order update event, `utils.order.getById.invalidate({ id: orderId })` is called.
- [ ] `useKDSOrdersRealtime()` creates a channel listening to all `INSERT` and `UPDATE` events on `public:Order`.
- [ ] On any order event in KDS, `utils.order.getAll.invalidate()` is called.
- [ ] Both hooks expose subscription status (`isLive: boolean`).
- [ ] Hooks cleanly call `supabaseBrowser.removeChannel(channel)` when unmounting or when `orderId` changes.
- [ ] Unit tests in `tests/hooks/use-order-realtime.test.ts` verify channel creation, subscription status, cache invalidation dispatch, and unmount removal.

## Blocked by

- #01 — Database Realtime Publication Migration

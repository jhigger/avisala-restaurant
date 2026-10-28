# 03 — Realtime BOH Domain Hooks & Lifecycle Tests

## Parent

#22

## What to build

Create `src/hooks/use-staff-realtime.ts` encapsulating real-time subscriptions to the `Staff` and `Shift` tables via `supabaseBrowser`. Listen for all CDC events (`INSERT`, `UPDATE`, `DELETE`) on `schema: 'public'` for both tables. On event receipt, invalidate `utils.staff.getAll` and `utils.staff.getShifts`. Properly remove websocket channels on unmount, and expose `isLive: boolean` for UI connection status indicators.

## Acceptance criteria

- [ ] `src/hooks/use-staff-realtime.ts` is implemented and exports `useStaffRealtime()`.
- [ ] Subscribes to `postgres_changes` for `table: 'Staff'` and `table: 'Shift'`.
- [ ] On receiving any event, invalidates relevant `staff.getAll` and `staff.getShifts` tRPC React Query caches.
- [ ] Exposes `isLive: boolean` indicating whether the channel status is `SUBSCRIBED`.
- [ ] Calls `supabaseBrowser.removeChannel(channel)` on component unmount without memory leaks.
- [ ] Unit/hook lifecycle tests verify subscription setup, invalidation triggers, and cleanup.

## Blocked by

- #23 — Database Migration for Back-of-House Realtime Publications

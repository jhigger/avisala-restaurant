# 04 — Kitchen Display System Realtime Feed

## Parent

#6

## What to build

Update the Kitchen Display System page (`src/app/admin/kds/page.tsx`) to remove periodic polling and integrate `useKDSOrdersRealtime()`. Add a subtle visual "Live Feed" badge to the header alongside the clock.

## Acceptance criteria

- [x] `refetchInterval: 3000` is removed from `api.order.getAll.useQuery` in `src/app/admin/kds/page.tsx`.
- [x] `useKDSOrdersRealtime()` is hooked into the component lifecycle.
- [x] A subtle "Live Feed" badge with an active green indicator dot is rendered in the header next to the clock.
- [x] Existing optimistic status mutations continue working smoothly with real-time invalidation.
- [x] Passes type checking and linting.

## Blocked by

- #02 — Realtime Domain Hooks & Lifecycle Tests

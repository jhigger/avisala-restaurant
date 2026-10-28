# 03 — Customer Order Tracking Realtime Stepper

## Parent

#6

## What to build

Update the customer order tracking page (`src/app/orders/[id]/page.tsx`) to remove periodic polling and integrate `useOrderRealtime(id)`. Add a subtle visual "Live Updates" badge to the order header.

## Acceptance criteria

- [ ] `refetchInterval` is completely removed from `api.order.getById.useQuery` in `src/app/orders/[id]/page.tsx`.
- [ ] `useOrderRealtime(id)` is hooked into the component lifecycle.
- [ ] A subtle "Live Updates" badge with an active green indicator dot is rendered in the header when connected.
- [ ] Component renders cleanly and passes type checking and linting.

## Blocked by

- #02 — Realtime Domain Hooks & Lifecycle Tests

# 02 — Fulfillment Board UI Granular Non-Blocking Button States

## Parent

#18

## What to build

Refactor `src/app/admin/kds/page.tsx` to integrate `useKDSOrderActions()`. Replace the global `disabled={updateStatusMutation.isPending}` prop on action buttons with `disabled={isOrderPending(order.id)}`. Render an inline loading spinner (e.g. `<Loader2 className="h-3.5 w-3.5 animate-spin" />`) on the transitioning order card so kitchen staff receive immediate feedback on the specific item being updated, while all other order action buttons remain fully enabled and interactive.

## Acceptance criteria

- [ ] `src/app/admin/kds/page.tsx` consumes `useKDSOrderActions()`.
- [ ] Action buttons in Pending, Preparing, and Ready columns use `disabled={isOrderPending(order.id)}`.
- [ ] Transitioning a card shows an inline spinner/loading state on that card's action button without altering other cards.
- [ ] Other cards in the same or different columns remain clickable and enabled while one or more transitions are pending.
- [ ] Clicking multiple action buttons in rapid succession executes transitions for all clicked orders.

## Blocked by

- #19 — Per-Order Transition State Hook & Concurrency Seam

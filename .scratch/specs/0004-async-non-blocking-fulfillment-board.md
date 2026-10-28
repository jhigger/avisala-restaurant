# Spec: Async Non-Blocking Fulfillment Board Actions

## Problem Statement

On the Kitchen Display System fulfillment board (`/admin/kds`), order status transitions (`Start Cooking`, `Mark Ready`, `Complete & Fulfill`) are powered by a single shared tRPC mutation (`updateStatusMutation`). The action buttons across all order cards currently bind their disabled state to the global boolean `disabled={updateStatusMutation.isPending}`. 

During high-volume kitchen operations, when a staff member advances the status of one order, **all buttons across every card in every column are disabled** until the network round trip completes and query invalidation finishes. Furthermore, if a chef wants to quickly transition three ready dishes in a row, the second and third clicks are blocked or ignored, creating workflow bottlenecks, sluggish feel, and friction during rush hours.

## Solution

Decouple order transition states so that fulfillment actions are fully asynchronous and non-blocking:
1. Track in-flight transitions on a granular, per-order basis (e.g. `pendingOrderIds: Set<string>`).
2. Only disable the button for the specific order currently undergoing a transition, displaying an inline loading spinner on that card.
3. Allow kitchen staff to click and transition multiple distinct orders concurrently without blocking the UI.
4. Manage optimistic updates so that multiple simultaneous mutations mutate and roll back their respective records without clobbering each other.

## User Stories

1. As a kitchen chef working during a dinner rush, I want to click "Start Cooking" on Order A and immediately click "Start Cooking" on Order B without waiting for Order A's request to finish.
2. As a kitchen dispatcher, I want visual confirmation (such as an inline spinner or disabled state) only on the specific card I just advanced, so I know which orders are actively syncing.
3. As an expediter, I want all other cards to remain fully enabled and clickable while any background status mutations are in flight.
4. As a user, if an individual order transition fails due to a network glitch, I want only that failed order to revert with an error alert, leaving other concurrent transitions intact.

## Implementation Decisions

### Architectural Shape
- Create a dedicated domain hook `useKDSOrderActions()` (or encapsulate inside `src/hooks/use-kds-order-actions.ts`).
- Hook maintains an internal reactive state: `pendingOrderIds: Set<string>` (or a record of `isPending: boolean` by `orderId`).
- Hook exposes:
  - `advanceStatus(orderId: string, currentStatus: OrderStatus): Promise<void>`
  - `isOrderPending(orderId: string): boolean`
  - `hasAnyPending(): boolean`

### Optimistic Cache Handling
- In `onMutate`:
  - Cancel outgoing `getAll` queries.
  - Snapshot previous cache.
  - Optimistically apply status change strictly to the target `orderId`.
  - Add `orderId` to `pendingOrderIds`.
- In `onError`:
  - Revert the target `orderId` to its previous state (or restore snapshot for that item).
- In `onSettled`:
  - Remove `orderId` from `pendingOrderIds`.
  - Invalidate `order.getAll` queries, while coordinating with active real-time websocket updates so in-flight transitions aren't prematurely replaced by stale snapshots.

### UI Changes in `src/app/admin/kds/page.tsx`
- Replace `disabled={updateStatusMutation.isPending}` on `Button` components with:
  ```tsx
  disabled={isOrderPending(order.id)}
  ```
- Render an inline spinning indicator (e.g. `<Loader2 className="h-3.5 w-3.5 animate-spin" />`) replacing or alongside the action icon when `isOrderPending(order.id)` is true.

## Testing Decisions
- **Seam Tests (`tests/kds-async-fulfillment.test.ts`)**:
  - Test that calling `advanceStatus(orderA)` sets `isOrderPending(orderA) === true` while `isOrderPending(orderB) === false`.
  - Test that triggering concurrent updates for Order A and Order B handles both promises without blocking or race-condition failures.
  - Test that failure of Order A reverts Order A without discarding Order B's optimistic state.
- **Component Tests**:
  - Verify that when Order A is pending, Order A's button is disabled and shows the loader, while Order B's button remains enabled and clickable.

## Out of Scope
- Drag-and-drop column transitions (separate board ergonomics feature).
- Bulk order transition checkboxes ("Select all and mark ready").

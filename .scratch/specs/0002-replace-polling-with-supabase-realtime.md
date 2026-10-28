# Spec: Replace Polling with Supabase Realtime Subscriptions

## Problem Statement

The Avisala Restaurant platform currently relies on client-side interval polling (every 3 seconds) for tracking order status on the customer order tracking page (`/orders/[id]`) and the Kitchen Display System (`/admin/kds`). This polling pattern generates excessive query volume against the server and database, increases network and CPU overhead, introduces up to 3 seconds of visual delay for state transitions, and creates race conditions with optimistic cache invalidation. Now that the project has transitioned to Supabase PostgreSQL with the browser client SDK configured, we can replace all polling loops with native Supabase Realtime websocket subscriptions (`postgres_changes`).

## Solution

Enable Supabase Realtime publication on the `Order` table in PostgreSQL, introduce encapsulated React hooks (`useOrderRealtime` and `useKDSOrdersRealtime`) that listen for row inserts and updates via websockets, invalidate the relevant tRPC React Query caches reactively upon event receipt, and remove all `refetchInterval` polling loops while adding visual "Live" indicators to the UI.

## User Stories

1. As a dining customer viewing my order tracking page (`/orders/[id]`), I want the status stepper to advance instantly when the kitchen updates my order without waiting for a periodic polling interval or refreshing the page.
2. As a kitchen chef or dispatcher using the Kitchen Display System (`/admin/kds`), I want new incoming orders and status updates to appear on the board in real time so that preparation workflows start immediately.
3. As a dining customer, I want my client to receive only websocket events pertaining to my specific order, preserving privacy and minimizing unnecessary network data usage.
4. As an operations engineer, I want the database migration to explicitly configure `ALTER PUBLICATION supabase_realtime ADD TABLE "Order";`, so that real-time event broadcasting is reproducibly tracked in source control.
5. As a developer, I want order realtime logic cleanly encapsulated in dedicated hooks (`src/hooks/use-order-realtime.ts`), keeping page components decoupled from Supabase channel lifecycle management.
6. As a user, I want subtle visual confirmation (a pulsing "Live" status badge) indicating that real-time connectivity to the restaurant server is active.

## Implementation Decisions

### Architectural Shape
- Build on top of the existing `supabaseBrowser` instance in `src/lib/supabase/client.ts`.
- Encapsulate subscription lifecycle inside custom hooks (`src/hooks/use-order-realtime.ts`), handling `channel.subscribe()`, event listeners, tRPC cache invalidation, and `supabaseBrowser.removeChannel(channel)` on component unmount.
- Integrate directly with TanStack React Query via tRPC's `useUtils()`: when an event fires, invalidate `utils.order.getById` or `utils.order.getAll`.

### Database & Realtime Configuration
- Create a Prisma migration adding the `Order` table to the `supabase_realtime` publication:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
  ```
- No changes required to `prisma/schema.prisma` itself since this is a PostgreSQL publication configuration.

### Module Contracts & Hooks
- `useOrderRealtime(orderId: string | undefined)`:
  - Subscribes to `postgres_changes` on `schema: 'public'`, `table: 'Order'`, `filter: 'id=eq.' + orderId`, `event: 'UPDATE'`.
  - On update: calls `void utils.order.getById.invalidate({ id: orderId })`.
  - Exposes `isConnected: boolean`.
- `useKDSOrdersRealtime()`:
  - Subscribes to `postgres_changes` on `schema: 'public'`, `table: 'Order'`, `event: '*'` (or `INSERT` & `UPDATE`).
  - On event: calls `void utils.order.getAll.invalidate()`.
  - Exposes `isConnected: boolean`.

### UI Changes
- In `src/app/orders/[id]/page.tsx`:
  - Remove `refetchInterval` from `api.order.getById.useQuery`.
  - Invoke `useOrderRealtime(id)`.
  - Add a subtle "Live Updates" badge in the order header.
- In `src/app/admin/kds/page.tsx`:
  - Remove `refetchInterval: 3000` from `api.order.getAll.useQuery`.
  - Invoke `useKDSOrdersRealtime()`.
  - Add a subtle "Live Feed" badge in the KDS navigation header next to the auto-updating clock.

## Testing Decisions

### Seam Definition
- **Unit / Hook Seam**: Test that `useOrderRealtime` and `useKDSOrdersRealtime` establish channels with the correct filter and event handlers, invoke tRPC invalidations on event callbacks, and properly tear down channels on unmount.
- **Component Seam**: Verify that `OrderTrackingPage` and `KDSPage` mount without active `refetchInterval` polling configurations and render the live status indicators.

### Quality Criteria
- Zero periodic polling requests over HTTP.
- Resilient channel teardown when navigating away (no channel leaks).
- Clean typescript compilation and lint checks.

## Out of Scope
- Realtime subscriptions for Tables, Reservations, and Inventory (deferred to future feature tickets).
- Supabase Row-Level Security (RLS) policies on websocket broadcast channels.

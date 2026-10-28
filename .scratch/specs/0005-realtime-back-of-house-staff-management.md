# Spec: Realtime Back-of-House & Staff Member Management

## Problem Statement

The Avisala Restaurant back-of-house (BOH) administration module currently suffers from two major operational limitations:
1. **No Staff Creation Flow**: While staff shifts can be scheduled and deleted in `src/app/admin/staff`, there is currently no API endpoint or UI form to add new staff members (`Staff` model). Managers cannot onboard new chefs, mixologists, servers, hosts, or riders into the system through the web portal.
2. **Missing Realtime Back-of-House Synchronization**: Unlike kitchen orders (which use Supabase Realtime CDC over websockets), the `Staff` and `Shift` tables are not subscribed to PostgreSQL CDC replication. If a manager schedules a shift, adds a staff member, or makes roster changes on one terminal, other managers or kitchen displays remain out of date until the entire page is manually refreshed.

## Solution

1. Enable PostgreSQL Change Data Capture (CDC) replication for back-of-house tables (`Staff` and `Shift`) in Supabase Realtime.
2. Introduce a new `createStaff` mutation in `staffRouter` with validation for name, title, role, kingdom affinity, and contact details.
3. Build an encapsulated `useStaffRealtime()` hook to listen for real-time inserts, updates, and deletions on `Staff` and `Shift`, reactively invalidating tRPC caches.
4. Implement an "Add Staff Member" modal dialog in `src/app/admin/staff/page.tsx` with Avisala kingdom styling, live validation, and optimistic updates.
5. Provide automated test coverage at the tRPC seam and hook layer.

## User Stories

1. As a restaurant manager, I want to onboard new staff members directly from the staff administration portal (`/admin/staff`) by specifying their name, role (`HEAD_CHEF`, `MIXOLOGIST`, etc.), kingdom affinity, and contact information.
2. As a manager scheduling shifts across multiple stations (Kitchen Hearth, Elixir Bar, Dining Floor), I want newly added staff members to immediately become available in the shift assignment dropdown without a manual page refresh.
3. As a shift supervisor observing the staff roster on a tablet, I want roster updates and newly scheduled shifts executed by another manager to reflect in real time via websockets.
4. As an operations lead, I want validation that prevents duplicate entries or invalid role/kingdom assignments.
5. As a developer, I want real-time subscription lifecycle management isolated within custom hooks (`src/hooks/use-staff-realtime.ts`) to keep UI components decoupled from Supabase client plumbing.

## Implementation Decisions

### Database & Realtime Publication
- Create a Prisma PostgreSQL migration executing:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE "Staff";
  ALTER PUBLICATION supabase_realtime ADD TABLE "Shift";
  ```
- Ensures all row insertions, updates, and deletions on both tables broadcast through the websocket channel.

### Backend Mutations in `staffRouter`
- Add `createStaff`:
  - Input schema:
    ```typescript
    z.object({
      fullName: z.string().min(2),
      title: z.string().min(2),
      kingdomAffinity: z.nativeEnum(Kingdom),
      role: z.nativeEnum(StaffRole),
      contact: z.string().min(5),
      avatarUrl: z.string().url().optional().or(z.literal("")),
    })
    ```
  - Creates the staff member record and returns it.
- Add `deleteStaff` (optional cascading delete of associated shifts if unassigned).

### Realtime Hook Architecture
- Create `src/hooks/use-staff-realtime.ts`:
  - Uses `supabaseBrowser` from `src/lib/supabase/client.ts`.
  - Subscribes to `postgres_changes` on `schema: 'public'` for tables `Staff` and `Shift`.
  - On any change, calls:
    - `void utils.staff.getAll.invalidate();`
    - `void utils.staff.getShifts.invalidate();`
  - Handles clean channel unsubscribe on component unmount.
  - Exposes `isLive: boolean` for UI connection status.

### Frontend UI (`/admin/staff`)
- Add "Add Staff Member" button next to "Add Shift" in the page header.
- Create an "Add Staff" Dialog with:
  - Full Name input
  - Title input (e.g., "Grand Royal Chef", "Master Mixologist")
  - Role dropdown (`HEAD_CHEF`, `SOUS_CHEF`, `MIXOLOGIST`, `SERVER`, `HOST`, `RIDER`)
  - Kingdom affinity selector (`LIREO`, `SAPIRO`, `HATHORIA`, `ADAMYA`, `GENERAL`)
  - Contact number/email input
  - Optional Avatar URL input
- Display a "Live Sync" status badge indicating active websocket connectivity to the staff channel.

## Testing Decisions
- **Router Seam Tests (`tests/staff-seam.test.ts`)**:
  - Test `staff.createStaff` creates and returns the staff member with correct role and kingdom affinity.
  - Test input validation rejects invalid roles, empty names, or malformed data.
  - Test shift assignment to newly created staff member works seamlessly with overlap conflict detection.
- **Hook Lifecycle Tests**:
  - Test `useStaffRealtime` registers event listeners for both `Staff` and `Shift` and invalidates caches appropriately.
  - Test channel teardown on unmount.

## Out of Scope
- Biometric clock-in / clock-out hardware integrations.
- Payroll and wage calculation features.

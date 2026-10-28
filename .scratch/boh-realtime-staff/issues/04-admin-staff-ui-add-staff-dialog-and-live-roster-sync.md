# 04 — Admin Staff UI: Add Staff Dialog & Live Roster Sync

## Parent

#22

## What to build

Update `src/app/admin/staff/page.tsx` to integrate `useStaffRealtime()` and add an "Add Staff Member" workflow. Render a new modal dialog allowing managers to input a staff member's full name, royal title, role selection (`StaffRole`), kingdom affinity (`Kingdom`), contact info, and avatar URL. Use `api.staff.createStaff.useMutation` with optimistic UI updates and instant cache invalidation. Render a live connection status badge in the header indicating active websocket synchronization.

## Acceptance criteria

- [ ] "Add Staff Member" button is visible in `src/app/admin/staff/page.tsx`.
- [ ] Dialog opens with accessible input controls for all staff attributes (Name, Title, Role, Kingdom, Contact, Avatar).
- [ ] Form submits via `createStaffMutation` with optimistic update to `staffList` and closes on success.
- [ ] Newly created staff members immediately show up in the "Select Staff Member" dropdown for scheduling shifts.
- [ ] `useStaffRealtime()` keeps the staff roster and shift calendar synchronized across tabs without manual refresh.
- [ ] Displays a subtle "Live Sync" status badge in the header.

## Blocked by

- #24 — Staff Creation & Management Mutations in tRPC Router
- #25 — Realtime BOH Domain Hooks & Lifecycle Tests

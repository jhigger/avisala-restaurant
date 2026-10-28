# 01 — Database Migration for Back-of-House Realtime Publications

## Parent

#22

## What to build

Create a versioned Prisma SQL migration that executes:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE "Staff";
ALTER PUBLICATION supabase_realtime ADD TABLE "Shift";
```
This enables PostgreSQL change data capture (CDC) over Supabase Realtime for the back-of-house staff and shift tables, allowing connected clients to receive real-time insert, update, and delete events.

## Acceptance criteria

- [ ] A new Prisma migration is generated in `prisma/migrations/*_enable_boh_realtime/migration.sql`.
- [ ] Migration contains `ALTER PUBLICATION supabase_realtime ADD TABLE "Staff";` and `ALTER PUBLICATION supabase_realtime ADD TABLE "Shift";`.
- [ ] Migration executes cleanly or is compatible with PostgreSQL migration deployment workflows.

## Blocked by

- None — can start immediately.

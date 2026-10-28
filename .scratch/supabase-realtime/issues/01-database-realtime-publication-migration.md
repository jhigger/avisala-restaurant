# 01 — Database Realtime Publication Migration

## Parent

#6

## What to build

Create a versioned Prisma SQL migration that executes `ALTER PUBLICATION supabase_realtime ADD TABLE "Order";`. This instructs Supabase's underlying PostgreSQL replication layer to broadcast CDC (change data capture) events over the Realtime websocket engine whenever rows in the `Order` table are inserted, updated, or deleted.

## Acceptance criteria

- [x] A new Prisma migration is generated in `prisma/migrations/*_enable_order_realtime/migration.sql`.
- [x] Migration contains `ALTER PUBLICATION supabase_realtime ADD TABLE "Order";`.
- [x] Migration succeeds or is compatible with PostgreSQL deployment workflows.

## Blocked by

- None — can start immediately.

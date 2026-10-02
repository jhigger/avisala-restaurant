# 0001: Hybrid Prisma ORM with Supabase Postgres and Supabase Client

Migrated the database from local SQLite to Supabase hosted PostgreSQL. We chose a hybrid data access pattern: retaining Prisma ORM as the primary schema manager and server-side tRPC query driver (via Supabase transaction pooler port 6543 and direct connection port 5432), while introducing `@supabase/supabase-js` for future client-side and realtime subscriptions.

## Considered Options

- **Prisma-only**: Kept Prisma alone. Rejected because future realtime updates (order updates, kitchen queue) benefit from native Supabase websockets.
- **Supabase-JS only**: Swapped Prisma completely for `@supabase/supabase-js`. Rejected because the entire tRPC API router layer is already tightly bound to Prisma type-safe queries.
- **SQLite**: Local single-file database. Rejected due to concurrency limitations, lack of cloud scaling, and inability to support live client realtime events.

## Consequences

- Requires configuring both `DATABASE_URL` (Supavisor pooled connection) and `DIRECT_URL` (direct connection for Prisma migrations) in environment variables.
- Numeric monetary fields are typed as `@db.Decimal(10, 2)` instead of SQLite `Float`.
- Enums are enforced natively in Postgres rather than as SQLite text strings.

# Spec: Migrate SQLite Database to Supabase PostgreSQL with Hybrid Client Architecture

## Problem Statement

The Avisala Restaurant platform currently relies on a single-file SQLite database located on local disk. Because SQLite lacks built-in network accessibility, concurrent write scalability, native cloud pooling, and realtime event subscriptions, the restaurant system cannot scale across multiple cloud instances or support live dining operations (such as real-time kitchen order queues or instant table reservation sync). Furthermore, SQLite stores monetary amounts as floating-point numbers and categorical states as plain text strings, exposing the system to financial rounding imprecisions and domain integrity drift.

## Solution

Migrate the database persistence tier to hosted Supabase PostgreSQL using a hybrid client architecture. The system will leverage Prisma ORM with connection pooling for reliable server-side schema management and tRPC transactions, while integrating the Supabase client SDK for future client-side and realtime subscriptions. All financial values will transition to exact two-decimal precision, and domain states (Kingdoms, Realms, Order Statuses, Table Statuses, Reservation Statuses, Staff Roles, and Days of the Week) will be validated and enforced as native PostgreSQL enums while preserving frontend casing compatibility.

## User Stories

1. As a dining customer, I want to place an order for kingdom-themed dishes, so that my order and item pricing are recorded with exact financial accuracy without rounding discrepancies.
2. As a dining customer, I want to book a reservation for a specific realm and time slot, so that my booking is reliably confirmed in the cloud database without concurrent double-booking conflicts.
3. As a dining customer, I want to view available menu items filtered by kingdom and category, so that I can discover dishes matching my culinary preferences.
4. As a kitchen chef, I want order items and elemental spice levels to be stored with strict domain enums, so that kitchen tickets never contain invalid or corrupted preparation states.
5. As a restaurant manager, I want pantry ingredient inventory costs and stock levels to be accurately tracked, so that replenish mutations maintain financial integrity.
6. As a restaurant manager, I want table statuses across all dining realms to update predictably, so that floor hosts can seat parties without conflicting reservations.
7. As a restaurant manager, I want staff shifts and kingdom affinities to be maintained in cloud storage, so that roster scheduling remains synchronized across management sessions.
8. As an operations engineer, I want the application to connect to Supabase through a connection pooler for routine queries and transactions, so that serverless spikes do not exhaust database connections.
9. As an operations engineer, I want schema migrations to run through a direct session connection, so that database structural updates can execute migration locks and DDL statements safely.
10. As a software developer, I want the database schema to define native PostgreSQL enums that mirror application domain categories, so that invalid states are rejected at the database boundary.
11. As a software developer, I want monetary figures represented as two-decimal precision numbers, so that subtotal, tax, delivery fee, and discount computations are mathematically exact.
12. As a software developer, I want a pre-configured Supabase client utility in the codebase, so that future realtime event listeners and client subscriptions can be implemented without re-architecting data connections.
13. As a software developer, I want a reproducible baseline database migration and seed script, so that new environments and development databases can be provisioned with full Encantadia demo data in one command.
14. As a software developer, I want environment variables validated at startup, so that missing database URLs or Supabase keys fail fast during build and boot.

## Implementation Decisions

### Architectural Shape
- Implement a hybrid data access layer: Prisma ORM remains the primary schema definition engine and server-side tRPC query interface, while the Supabase client SDK is introduced for future client-side events.
- Configure two distinct database connection channels: a transaction-pooled connection string targeting port 6543 for application queries and transactions, and a direct session connection targeting port 5432 for schema migrations and DDL operations.

### Schema & Data Integrity
- Transition database provider from SQLite to PostgreSQL.
- Convert all monetary fields across menu items, ingredients, orders, and order items from floating-point numbers to exact decimal representation with two decimal places.
- Retain inventory stock quantities and recipe requirement amounts as floating-point numbers to accommodate fractional portioning and weights.
- Replace unconstrained text columns for categorical attributes with native database enums, preserving existing string casing to maintain backward compatibility with frontend user interface components and filters.
- Enforce relational cascade deletion rules across recipes, order items, and staff shifts.

### Module Contracts & APIs
- Update server-side environment validation to enforce the presence and format of connection URLs (pooled database URL, direct database URL) and public Supabase client credentials.
- Export standardized client initialization helpers providing access to Supabase client instances in both browser and server environments.
- Adjust order creation and inventory replenishment logic to perform exact decimal arithmetic when computing subtotals, tax rates, delivery fees, and line item totals.

## Testing Decisions

### Seam Definition
- The primary testing seam is the server API router procedure interface (`createCaller`). 
- Testing at this boundary exercises the complete pipeline: input validation, domain enum parsing, decimal price computations, database transaction execution against PostgreSQL, and serialization back to the caller.
- This represents the highest server-side seam prior to the HTTP transport layer, providing maximum behavioral coverage without coupling to internal query mechanics or mock databases.

### Quality Criteria
- Tests must execute real queries and transactions against the PostgreSQL database instance.
- Tests must verify external behavior: successfully reading menu items by kingdom, placing orders with accurate monetary totals, updating inventory upon order submission, and booking reservations for valid realms.
- Tests must assert that invalid enum values or negative monetary values are rejected with validation errors.

### Prior Art
- The codebase relies on end-to-end tRPC caller patterns and Prisma database seed routines.

## Out of Scope

- Supabase Row-Level Security (RLS) policies and row-level authorization rules.
- Supabase Auth user management, OAuth providers, and session cookies.
- Supabase Storage bucket provisioning and image upload workflows.
- Realtime websocket subscriptions in frontend React components (client SDK is scaffolded, but UI subscriptions will be added in a dedicated feature phase).
- Migrating historical records from the local SQLite disk file (the new database will be populated fresh using the canonical seed routine).

## Further Notes

- The database migration baseline will be recorded as a versioned migration.
- The project's existing tRPC data transformers and serialization utilities natively support Decimal objects without requiring manual string conversion over the wire.

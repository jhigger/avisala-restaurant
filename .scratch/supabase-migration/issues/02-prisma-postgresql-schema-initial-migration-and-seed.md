# 02 — Prisma PostgreSQL Schema, Initial Migration & Seed

## Parent

#1

## What to build

Migrate the database schema definition from SQLite to PostgreSQL. Introduce native database enums while preserving existing frontend casing, upgrade monetary columns to exact two-decimal precision, record a baseline migration against the live Supabase database, and populate the database using the canonical seed script.

## Acceptance criteria

- [x] Database datasource provider is transitioned to PostgreSQL with direct connection URL support for migrations.
- [x] Monetary columns across menu items, ingredients, orders, and order items are converted to two-decimal precision numbers.
- [x] Inventory quantities and recipe requirements remain floating-point numbers for flexible portioning.
- [x] Domain categorical values (Kingdoms, Realms, Order Statuses, Payment Methods, Payment Statuses, Table Statuses, Reservation Statuses, Staff Roles, Days of the Week) are defined as native database enums preserving existing text casing.
- [x] Initial database migration baseline is recorded and successfully applied against the Supabase PostgreSQL database.
- [x] Database seed routine executes cleanly against the new PostgreSQL database, populating complete demo data across all domain models.

## Blocked by

- #2 (01 — Supabase Environment & Client Scaffold)

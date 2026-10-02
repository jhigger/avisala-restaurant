# 01 — Supabase Environment & Client Scaffold

## Parent

#1

## What to build

Configure the application's runtime environment to connect to Supabase and establish the client library infrastructure. This provides validated access to both pooled and direct PostgreSQL connections and sets up browser and server client utilities for future realtime and client-side interactions.

## Acceptance criteria

- [x] Duplicate local SQLite configurations are removed from the environment configuration.
- [x] The transaction-pooled connection URL targeting the pooler is configured with pooling enabled.
- [x] The direct session connection URL is configured for schema migrations and administrative access.
- [x] Client-side public Supabase URL and anonymous key variables are configured and strictly validated at startup.
- [x] Standardized Supabase browser and server client singletons are exported and available for application consumption.
- [x] Environment validation passes during application startup and build checks.

## Blocked by

- None — can start immediately.

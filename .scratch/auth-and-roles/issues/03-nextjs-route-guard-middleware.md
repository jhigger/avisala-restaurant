# 03 — Next.js Route Guard Middleware for /admin Routes

## Parent

#12

## What to build

Implement Next.js `src/middleware.ts` to inspect incoming requests to `/admin` and sub-routes (`/admin/kds`, `/admin/inventory`, `/admin/tables`, `/admin/staff`). Using `@supabase/ssr`, refresh active user sessions from cookies and check the user's role. If unauthenticated, redirect to `/login?next=${encodeURIComponent(pathname)}`. If authenticated but not an `ADMIN`, redirect to `/` with an unauthorized query parameter or forbidden alert.

## Acceptance criteria

- [ ] `src/middleware.ts` is configured with a matcher targeting `/admin/:path*` and auth routes.
- [ ] Unauthenticated requests to `/admin` or `/admin/*` are redirected to `/login?next=...`.
- [ ] Authenticated users with role `CUSTOMER` attempting to access `/admin` or `/admin/*` are blocked and redirected safely.
- [ ] Authenticated users with role `ADMIN` are allowed through to the admin pages.
- [ ] Middleware correctly preserves and forwards updated auth session cookies.

## Blocked by

- #14 — Supabase SSR Auth Client & tRPC Protected/Admin Procedures

# 02 — Supabase SSR Auth Client & tRPC Protected/Admin Procedures

## Parent

#12

## What to build

Install `@supabase/ssr` to enable cookie-based session management across Next.js Server Components, Route Handlers, and Server Actions. Update `src/lib/supabase/` with SSR helpers (`createServerClient`, `createBrowserClient`). Update `src/server/api/trpc.ts` to extract the user session in `createTRPCContext` and define `protectedProcedure` (requires authenticated user) and `adminProcedure` (requires `role === 'ADMIN'`).

## Acceptance criteria

- [ ] `@supabase/ssr` is added to `package.json` dependencies.
- [ ] `src/lib/supabase/server.ts` creates a cookie-aware Supabase server client using `@supabase/ssr` with Next.js headers/cookies.
- [ ] `src/server/api/trpc.ts` `createTRPCContext` resolves `user` session and queries `Profile` for role information.
- [ ] `protectedProcedure` is defined, throwing `TRPCError({ code: "UNAUTHORIZED" })` if no authenticated user is in context.
- [ ] `adminProcedure` is defined, throwing `TRPCError({ code: "FORBIDDEN" })` if the user is not an `ADMIN`.
- [ ] Unit/seam tests verify procedure authorization assertions.

## Blocked by

- #13 — Database Profile Model & Role Migration

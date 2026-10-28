# Spec: Authentication and User/Admin Role Separation

## Problem Statement

Currently, the Avisala Restaurant application has no authentication or authorization layer. Anyone who visits `/admin`, `/admin/kds`, `/admin/inventory`, `/admin/tables`, or `/admin/staff` has unrestricted access to manage staff shifts, pantry inventory, dining table allocations, and kitchen orders. Furthermore, all tRPC procedures are declared as `publicProcedure` without authentication or authorization context, allowing arbitrary mutation of administrative data. Customers also lack persistent account identities, relying solely on unauthenticated order numbers and emails.

## Solution

Introduce a unified authentication and role-based access control (RBAC) system powered by Supabase Auth and `@supabase/ssr`:
1. Distinguish between customer accounts (`CUSTOMER`) and administrative staff (`ADMIN`).
2. Add a `Profile` model in Prisma linked to Supabase's `auth.users` table.
3. Secure the `/admin` routes via Next.js middleware, redirecting unauthenticated visitors to `/login` and blocking non-admin accounts.
4. Enhance `createTRPCContext` to validate Supabase auth sessions, providing `protectedProcedure` (authenticated users) and `adminProcedure` (admins only).
5. Provide branded login, registration, and logout flows matching the Encantadia theme.

## User Stories

1. As a restaurant administrator or manager, I want to log in with my admin credentials so that only authorized personnel can access back-of-house operations (`/admin`, `/admin/kds`, `/admin/inventory`, `/admin/tables`, `/admin/staff`).
2. As a customer, I want to create an account and log in so that my orders and reservations are associated with my profile.
3. As a dining guest browsing the restaurant, I want to freely browse the menu and explore without being forced to log in, but have clear login/signup access from the navigation bar.
4. As an unauthenticated user attempting to visit `/admin`, I want to be redirected to `/login?next=/admin` with a clear notice.
5. As an authenticated customer attempting to visit `/admin`, I want to be blocked with a 403 Forbidden message rather than seeing sensitive operational data.
6. As a developer, I want tRPC mutation and query endpoints protected with `adminProcedure` and `protectedProcedure` so that API security cannot be bypassed at the network layer.

## Implementation Decisions

### Architectural Shape
- Use `@supabase/ssr` to implement cookie-based session management compatible with Next.js 15 App Router and React Server Components.
- Implement Next.js `middleware.ts` using `createServerClient` from `@supabase/ssr` to refresh session cookies and protect `/admin/:path*`.
- Update `src/server/api/trpc.ts` to inspect incoming cookies/headers, retrieve user session from Supabase, look up the user's role from Prisma, and enforce authorization in middleware.

### Database Schema
- In `prisma/schema.prisma`:
  ```prisma
  enum UserRole {
    CUSTOMER
    ADMIN
  }

  model Profile {
    id        String   @id // matches Supabase auth.users.id
    email     String   @unique
    fullName  String?
    role      UserRole @default(CUSTOMER)
    kingdom   Kingdom  @default(GENERAL)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```
- Generate Prisma migration and seed a default administrative user.

### Auth & Middleware Flow
- Next.js `middleware.ts`:
  - Intercepts requests to `/admin/:path*`.
  - Refreshes auth tokens via `@supabase/ssr`.
  - Redirects unauthenticated users to `/login?next=${pathname}`.
  - Verifies user profile role; redirects non-admin users to `/` with an unauthorized alert.

### Module Contracts & tRPC Procedures
- `src/server/api/trpc.ts`:
  - `createTRPCContext`: extracts user session and user profile.
  - `publicProcedure`: accessible to anyone.
  - `protectedProcedure`: guarantees `ctx.session.user` exists (401 UNAUTHORIZED).
  - `adminProcedure`: guarantees `ctx.session.user.role === 'ADMIN'` (403 FORBIDDEN).
- Procedure Migration:
  - `staffRouter`, `inventoryRouter`, `tableRouter`: switch mutations and queries to `adminProcedure`.
  - `orderRouter`: public for placing guest orders, but administrative actions (`updateStatus`, `getAll`) require `adminProcedure`.

### UI & Navigation
- Customer navigation bar:
  - Shows "Log In" / "Sign Up" buttons when unauthenticated.
  - Shows user name, kingdom affinity badge, and "Sign Out" dropdown when authenticated.
  - If user is an `ADMIN`, displays an "Admin Portal" link.
- Admin dashboard layout:
  - Displays administrator badge, user email, and quick "Sign Out" button.
- Dedicated `/login` and `/register` pages styled with Avisala kingdom motifs and kingdom selection.

## Testing Decisions
- **Integration Tests (`tests/auth-seam.test.ts`)**:
  - Test `publicProcedure` allows unauthenticated access.
  - Test `protectedProcedure` rejects unauthenticated requests with 401 and accepts valid user context.
  - Test `adminProcedure` rejects non-admin users with 403 and permits admin users.
- **Middleware Tests**:
  - Test route protection on `/admin/*` redirects to login.
- **Component Tests**:
  - Test navigation bar renders login state vs authenticated user profile.

## Out of Scope
- OAuth third-party providers (Google, GitHub) — password-based email auth initially.
- Multi-factor authentication (MFA).
- Customer self-serve password reset via email service (can be done via Supabase dashboard).

# 04 — Auth UI Flows (Login, Register & Role-Aware Navigation)

## Parent

#12

## What to build

Create dedicated, kingdom-styled auth pages for `/login` and `/register` using Supabase Auth (email/password). Update the main customer layout navigation header in `src/app/layout.tsx` to display auth state (Log In button vs user profile avatar, name, and logout button). If the logged-in user has role `ADMIN`, show a link to the "Admin Portal". In the admin layout (`src/app/admin/layout.tsx` or header), display the admin user info and an explicit Sign Out button.

## Acceptance criteria

- [ ] `/login` route renders an Avisala-themed login form with email and password inputs, handling authentication and redirecting to the `next` URL (defaulting to `/` or `/admin`).
- [ ] `/register` route renders an account registration form capturing email, password, full name, and kingdom preference (`LIREO`, `SAPIRO`, `HATHORIA`, `ADAMYA`).
- [ ] Main site header dynamically shows "Log In / Sign Up" buttons when logged out, and user badge with "Sign Out" dropdown when logged in.
- [ ] Main site header includes an "Admin Portal" link if and only if the current user has the `ADMIN` role.
- [ ] Admin dashboard header displays the current admin user and provides a functioning "Sign Out" button.
- [ ] Client auth state syncs cleanly with Supabase browser client.

## Blocked by

- #15 — Next.js Route Guard Middleware for /admin Routes

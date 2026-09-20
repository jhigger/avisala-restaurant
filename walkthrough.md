# Avisala Restaurant - Implementation & Verification Walkthrough

**Avisala Restaurant** is an Encantadia-themed full-service dining web application built with the T3 stack (Next.js 15 App Router, TypeScript, tRPC, Prisma with SQLite, and Tailwind CSS v4) customized with the **shadcn/ui Luma preset (`--preset b1VlIttI`)** and deep elemental kingdom theming.

---

## 1. What Was Built

### A. The Four Elemental Realms & Menu
- **Lireo (Air / Hangin)**: Sapphire accents, ethereal herbal teas, poultry, and floating salads.
- **Sapiro (Earth / Lupa)**: Amber/gold tones, hearty root vegetables, stews, and feasts.
- **Adamya (Water / Tubig)**: Aquamarine/cyan palettes, coastal seafood, ceviches, and spirulina elixirs.
- **Hathoria (Fire / Apoy)**: Crimson/ruby vibrancy, volcanic charcoal grilled meats, and fiery chilis.
- **Customization Modal**: Patrons can tailor the **Brilyante Spice Level (0 to 5)**, specify dietary restrictions, and add special kitchen notes.

### B. Online Ordering & Digital Payment Checkout
- **Slide-out Cart**: Responsive sheet with real-time price tally, quantity adjustments, and fee breakdown.
- **Checkout Modal**: Support for simulated payment gateways:
  - **GCash** & **Maya** (Philippine e-wallets)
  - **Credit/Debit Card**
  - **Encantadia Gold (Sapiro Bullion)**
- **Automated Stock Deduction**: Order placement atomically validates and decrements ingredient stocks in the database, automatically marking depleted items as unavailable.
- **Live Order Tracking**: Customer order tracking page (`/orders/[id]`) with live polling status stepper: `PENDING` ➔ `PREPARING` ➔ `READY` ➔ `FULFILLED`.

### C. Table Reservation with Realm Dining Sections
- **Interactive Booking**: Guests choose their desired Realm dining section, table capacity, party size, date, time slot, and special requests.
- **Slot Conflict Handling**: Backend tRPC validation prevents overlapping active bookings on the same table.
- **Boarding Pass & QR Pass**: Digital reservation pass generated upon confirmation.

### D. Operational Backoffice & KDS
- **Kitchen Display System (KDS)** at `/admin/kds`:
  - 3-column Kanban board (`Pending`, `Preparing`, `Ready to Serve`).
  - Elapsed order timers, itemized ingredient breakdowns, and 1-click status advancement.
- **Host Seating & Table Desk** at `/admin/tables`:
  - Floorplan view categorized by kingdom, live table occupancy statuses (`AVAILABLE`, `OCCUPIED`, `RESERVED`, `CLEANING`), and quick-seat action.
- **Pantry Inventory Monitor** at `/admin/inventory`:
  - Real-time stock levels, low-stock visual warning badges, and instant restock action with automatic reactivation of depleted menu dishes.
- **Staff Roster & Weekly Shift Scheduler** at `/admin/staff`:
  - 7-day schedule grid across Morning, Afternoon, and Evening shifts.

---

## 2. Verification & Build Results

### Automated Build & Compilation
- **TypeScript**: `pnpm tsc --noEmit` passed with **0 errors**.
- **Turbopack Build**: `pnpm next build --turbo` successfully built all 11 static and dynamic pages:
  - `○ /` (Home Page)
  - `○ /menu` (Menu with kingdom tabs & spice selector)
  - `○ /reserve` (Table reservation desk)
  - `○ /admin` (Operations KPI dashboard)
  - `○ /admin/kds` (Kitchen display Kanban)
  - `○ /admin/tables` (Host floorplan & seating)
  - `○ /admin/inventory` (Pantry & restock monitor)
  - `○ /admin/staff` (7-day shift scheduler)
  - `ƒ /orders/[id]` (Live order status tracker)
  - `ƒ /api/trpc/[trpc]` (tRPC endpoint)

### HTTP Route Status Verification
Direct HTTP verification against the active local server (`http://localhost:3000`) yielded:
```text
/                  -> 200 OK
/menu              -> 200 OK
/reserve           -> 200 OK
/admin             -> 200 OK
/admin/kds         -> 200 OK
/admin/tables      -> 200 OK
/admin/inventory   -> 200 OK
/admin/staff       -> 200 OK
```

---

## 3. How to Access & Test the Application

The Next.js application is running locally at **`http://localhost:3000`**.

1. **Browse the Menu**: Navigate to `http://localhost:3000/menu`. Filter by Lireo, Hathoria, Sapiro, or Adamya. Click **"Customize"** on any dish to adjust spice levels and add to bag.
2. **Place an Order**: Click the Cart icon in the navbar, review items, proceed to Checkout, select GCash/Maya/Card, and submit. You will be redirected to the live order tracker (`/orders/<ID>`).
3. **Kitchen Fulfillment**: Open `http://localhost:3000/admin/kds` in another tab to observe your new order in the **Pending** column. Advance it to **Preparing** and **Ready**.
4. **Reserve a Table**: Visit `http://localhost:3000/reserve` to book a table in your preferred kingdom section.
5. **Manage Tables & Inventory**: Visit `http://localhost:3000/admin/tables` and `http://localhost:3000/admin/inventory` to seat patrons and restock ingredients.

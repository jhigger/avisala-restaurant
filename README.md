# ⚜️ Avisala Restaurant

An Encantadia-themed full-service dining web application built on the **T3 Stack** (Next.js 15 App Router, TypeScript, tRPC v11, Prisma, Supabase PostgreSQL, and Tailwind CSS v4) with **shadcn/ui** and optimistic updates.

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.18+ or v20+
- **pnpm**: v9+ or v10+ (`npm install -g pnpm`)
- **Git**
- A **Supabase** project (PostgreSQL instance with connection pooling enabled)

---

## 🚀 Setup & Installation (Step-by-Step)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd avisala-restaurant
```

### 2. Install Dependencies
```bash
pnpm install
```
> *Note: This automatically triggers `prisma generate` via the `postinstall` script to generate `@prisma/client`.*

### 3. Configure Environment Variables
Create your `.env` file from `.env.example`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

Ensure `.env` contains your Supabase PostgreSQL credentials:
```env
# Connection pooled connection (Supabase Transaction Pooler, port 6543)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# Direct connection for migrations and DDL (Supabase Session Pooler or direct, port 5432)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require"

# Supabase Web API
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

NODE_ENV="development"
```

### 4. Initialize & Seed the PostgreSQL Database
Apply Prisma migrations to your Supabase PostgreSQL instance and populate it with Encantadian kingdom menus, pantry ingredients, dining tables, and staff rosters:

```bash
# Apply migrations to live Supabase PostgreSQL
pnpm db:migrate

# Seed kingdom dishes, tables, staff, and initial orders
pnpm db:seed
```

### 5. Start the Development Server
```bash
pnpm dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧭 Application Routes

### Customer Portal
- **`/`**: Hero landing page & realm showcases.
- **`/menu`**: Elemental menu with kingdom tabs (Lireo, Hathoria, Sapiro, Adamya), spice ratings (Lv. 0–4), dietary filters, and add-to-bag modal.
- **`/reserve`**: Table reservation booking with realm selection, party size, calendar picker, and instant digital boarding pass.
- **`/orders/[id]`**: Real-time order fulfillment stepper (`PENDING` ➔ `PREPARING` ➔ `READY` ➔ `FULFILLED`) polling live kitchen status.

### Operations Backoffice Portal
- **`/admin`**: Operations KPI dashboard with active metrics and quick-launch links.
- **`/admin/kds`**: Kitchen Display System (KDS) 4-stage Kanban with elapsed timers and optimistic 1-click status advancement.
- **`/admin/tables`**: Dining table floorplan grid with real-time occupancy toggling (`AVAILABLE`, `OCCUPIED`, `RESERVED`) and guest seating.
- **`/admin/inventory`**: Real-time ingredient pantry monitor with low-stock warnings, restock logging, and automatic dish availability sync.
- **`/admin/staff`**: 7-day brigade shift schedule across 4 operational stations with conflict detection.

---

## 🛠️ Handy Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts Turbopack development server at `http://localhost:3000` |
| `pnpm check` | Runs full strict linting (`next lint`) and type check (`tsc --noEmit`) |
| `pnpm db:studio` | Opens Prisma Studio visual database GUI in browser |
| `pnpm db:migrate` | Deploys pending Prisma migrations to Supabase PostgreSQL |
| `pnpm db:push` | Pushes Prisma schema state directly to database |
| `pnpm db:seed` | Re-seeds database with demo data |
| `pnpm format:write` | Formats all files using Prettier |
| `pnpm build` | Builds optimized production bundle |
| `pnpm start` | Runs production server |

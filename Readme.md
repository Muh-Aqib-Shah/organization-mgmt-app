# Organization Management Admin Dashboard

A production-minded full-stack admin dashboard built with **React + Supabase** as part of a take-home engineering assessment. It lets authenticated admins create typed organizations, invite members by email, and manage everything through a clean, responsive UI.

**Live URLs**

- 🚀 Production: `https://organization-mgmt-app.vercel.app/` _(deployed from `production`)_
- 🔧 Development Preview: `https://organization-mgmt-app-git-development-aqibs-projects-f7435a81.vercel.app/` _(deployed from `development`)_

**Test Credentials**

```
Email:    admin@demo.com
Password: Admin123!
```

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Design Decisions](#architecture--design-decisions)
4. [Features](#features)
5. [Data Model](#data-model)
6. [Repository Structure](#repository-structure)
7. [Branching Strategy](#branching-strategy)
8. [Frontend Setup](#frontend-setup)
9. [Backend Setup (Supabase)](#backend-setup-supabase)
10. [Environment Variables](#environment-variables)
11. [Deployment](#deployment)
12. [Row Level Security (RLS)](#row-level-security-rls)
13. [Edge Functions](#edge-functions)
14. [Tradeoffs & Shortcuts](#tradeoffs--shortcuts)
15. [What I'd Do With Another Day](#what-id-do-with-another-day)

---

## Project Overview

This dashboard allows an **admin user** to:

- Sign up / sign in with email and password (Supabase Auth)
- Create organizations of three types: **School**, **Nonprofit**, and **Business**
  - The `school` type exposes an additional conditional field: **School District**
- Invite members to an organization by email via a **Supabase Edge Function**
- View a paginated, filterable member list with statuses (`invited` / `active`)
- Browse all organizations they own in a directory with member counts and type badges

All server state is managed with **TanStack React Query**; all forms are validated client-side with **React Hook Form + Zod** and re-validated server-side in the Edge Function.

---

## Tech Stack

### Frontend

| Tool                    | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| React 18 + TypeScript   | UI layer, strict mode enabled             |
| Vite (SWC plugin)       | Build tool and dev server                 |
| React Router v6         | Client-side routing with protected routes |
| Tailwind CSS v4         | Utility-first styling                     |
| shadcn/ui (Radix-based) | Accessible component primitives           |
| TanStack React Query v5 | All server state, cache invalidation      |
| React Hook Form + Zod   | Form handling and schema validation       |
| Lucide React            | Icon library                              |

### Backend

| Tool                           | Purpose                              |
| ------------------------------ | ------------------------------------ |
| Supabase (PostgreSQL)          | Primary database                     |
| Supabase Auth                  | Email/password authentication        |
| Supabase Edge Functions (Deno) | Server-side invitation logic         |
| Row Level Security (RLS)       | Per-row authorization on every table |
| `citext` extension             | Case-insensitive email uniqueness    |
| `pgcrypto` extension           | UUID generation                      |

---

## Architecture & Design Decisions

### Authentication Flow

Supabase Auth handles session management. The `AuthProvider` context wraps the app, listening to `onAuthStateChange` so the session state propagates reactively. `ProtectedRoute` checks `isAuthenticated` before rendering any admin route — unauthenticated visitors are immediately redirected to `/auth`.

### Organization Types and Conditional Fields

Organization type is a PostgreSQL `enum` (`school`, `nonprofit`, `business`). The `organizations` table includes a nullable `school_district` column that is only relevant when `type = 'school'`. On the frontend, the Create Organization form conditionally renders the School District input when that type is selected, and the Zod schema enforces that it is required in that case.

### Invitation via Edge Function

Member invitations are intentionally routed through a **Supabase Edge Function** (`send-invite`) rather than executed directly from the client. This ensures:

1. The caller's JWT is verified server-side.
2. The Edge Function confirms the caller is the organization's `created_by` owner before inserting.
3. Duplicate email invitations within the same org are prevented by a database-level unique constraint (`organization_member_unique_email`), returning a `409 Conflict` to the client.
4. Input is re-validated with Zod inside the function.

The architecture makes it trivial to add real email delivery (e.g. Resend, SendGrid) in the function — the `// TODO: send email here` insertion point is explicit.

### Server State with React Query

Every data-fetching operation uses `useQuery`. After a successful invitation, `queryClient.invalidateQueries` forces a refetch of the member list so the UI updates without a page reload. The `QueryClient` is configured with `staleTime: 60s` and `retry: 1` to avoid excessive refetches.

---

## Features

### 1. Authentication (`/auth`)

- Sign-up with email + password (Zod-validated: 8+ chars, uppercase, lowercase, number)
- Sign-in with email + password
- Password visibility toggles
- Inline server error display
- Redirect to `/dashboard` on success; redirect to `/auth` when unauthenticated

### 2. Organization Directory (`/dashboard`)

- Lists all organizations owned by the signed-in admin
- Each row: name, type icon/color, member count
- Aggregate stats: total organizations, total members
- Empty state when no organizations exist
- Click any row to navigate to its detail page

### 3. Create Organization (`/organization/create`)

- Fields: **Name**, **Type** (School / Nonprofit / Business), conditional **School District** (School only)
- Client-side validation via Zod + React Hook Form
- On success: React Query cache invalidation → org appears in directory instantly

### 4. Organization Detail & Member Management (`/organization/:orgId`)

- Organization header with type icon
- Inline invite form (email input → calls Edge Function)
- Member table with: avatar, email, role badge, status badge, joined date
- Tabs: All Members / Accepted / Invited with live counts
- Search members by email
- Filter by role (All / Admin / Member)
- Pagination (6 members per page)
- Duplicate invitation protection (shows error on conflict)

---

## Data Model

### `profiles`

```sql
id          uuid  PK → auth.users(id)
full_name   text
is_admin    boolean  DEFAULT false
```

### `organizations`

```sql
id              uuid        PK, gen_random_uuid()
name            text        NOT NULL
type            org_type    NOT NULL  -- 'school' | 'nonprofit' | 'business'
created_by      uuid        FK → auth.users(id)
created_at      timestamptz DEFAULT now()
school_district text        NULL      -- only populated when type = 'school'

UNIQUE (created_by, name, type)
```

### `organization_members`

```sql
id               uuid         PK, gen_random_uuid()
organization_id  uuid         FK → organizations(id) ON DELETE CASCADE
user_id          uuid         FK → auth.users(id), nullable (pre-accept)
email            citext       NOT NULL
status           member_status  -- 'invited' | 'active'
role             member_role    -- 'member' | 'admin' | 'owner'
invited_at       timestamptz  DEFAULT now()
joined_at        timestamptz  NULL

UNIQUE (organization_id, email)
```

**Enums**

- `org_type`: `school`, `nonprofit`, `business`
- `member_status`: `invited`, `active`
- `member_role`: `member`, `admin`, `owner`

---

## Repository Structure

```
.
├── frontend/                     # React + Vite application
│   ├── src/
│   │   ├── assets/               # Static images
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui primitives
│   │   │   ├── navbar/           # Auth-aware navigation bar
│   │   │   ├── footer/           # Footer component
|   |   |   |──  auth/            # Authentication Components
|   |   |   |──  create-organization/  # Create Org Form Components
|   |   |   |──  dashboard/       # Dashboard Components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── lib/
│   │   │   ├── auth/             # AuthContext + auth hooks
│   │   │   ├── organiztion/      # React Query hooks, org/role meta helpers
│   │   │   ├── schema/           # Zod schemas (auth, org)
│   │   │   ├── types/            # TypeScript interfaces
│   │   │   ├── supabase.ts       # Supabase client
│   │   │   └── utils.ts          # cn() utility
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx          # Sign in / Sign up
│   │   │   ├── DashboardPage.tsx     # Organization directory
│   │   │   ├── CreateOrganization.tsx# Create org form
│   │   │   └── Organization.tsx      # Org detail + members
│   │   ├── App.tsx               # Router + AuthProvider
│   │   └── main.tsx              # Entry point + QueryClientProvider
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
└── backend/
    └── supabase/
        ├── migrations/
        │   ├── 20260605200316_init_schema.sql   # Tables, types, constraints
        │   └── 20260606210000_rls_policies.sql  # RLS policies
        ├── functions/
        │   └── send-invite/
        │       ├── index.ts      # Edge Function (Deno)
        │       └── deno.json     # Import map
        ├── seed.sql              # (optional) seed data
        └── config.toml           # Supabase local dev config
```

---

## Branching Strategy

```
production           ← production (deploys to Production Vercel URL)
  └── development  ← default working branch (deploys to Preview Vercel URL)
        └── feature/send-invite
        └── feature/db-schema
        └── feature/auth-and-dashboard
```

- All feature work happens on short-lived branches off `development`.
- Feature branches are merged into `development` via **Pull Request**.
- Once a milestone is stable, `development` is merged into `main` via PR.
- At least **2 pull requests** are required and documented with descriptions and testing steps.

**PR naming convention:** `feat:`, `fix:`, `chore:` prefixes (Conventional Commits style).

---

## Frontend Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Muh-Aqib-Shah/organization-mgmt-app.git
cd organization-mgmt-app/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in your Supabase values (see Environment Variables)

# 4. Start the development server
npm run dev
# App runs at http://localhost:5173

# 5. Build for production
npm run build
```

---

## Backend Setup (Supabase)

### Option A — Use the hosted project (recommended for reviewers)

The Supabase project is already provisioned. Use the test credentials above to log in to the deployed app immediately.

### Option B — Recreate from scratch

#### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and note your **Project URL** and **anon key**.

#### 2. Run migrations

In the Supabase Dashboard → **SQL Editor**, run the migration files in order:

```sql
-- Step 1: Schema (tables, types, constraints)
-- Paste contents of: backend/supabase/migrations/20260605200316_init_schema.sql

-- Step 2: RLS policies
-- Paste contents of: backend/supabase/migrations/20260606210000_rls_policies.sql
```

Or use the Supabase CLI:

```bash
cd backend
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

#### 3. Deploy the Edge Function

```bash
cd backend
supabase functions deploy send-invite
```

#### 4. (Optional) Local development with Supabase CLI

```bash
cd backend
supabase start          # starts local Postgres, Auth, Edge Runtime
supabase db reset       # applies migrations + seed
supabase functions serve send-invite   # hot-reloads the function
```

---

## Environment Variables

### Frontend — `.env.local`

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_SUPABASE_API_KEY=<your-anon-key>
```

> ⚠️ The anon key is safe to expose on the client — RLS enforces authorization at the database level. **Never** put your `service_role` key in frontend code.

### Edge Function secrets (set in Supabase Dashboard → Edge Functions → Secrets)

The `send-invite` function uses `ctx.supabaseAdmin` (injected by `@supabase/server`) which automatically uses the service-role key stored securely in the Supabase runtime. No secrets need to be manually configured beyond what Supabase provides.

### Vercel environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for both Production and Preview environments:

| Variable                 | Value                     |
| ------------------------ | ------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key    |
| `VITE_SUPABASE_API_KEY`  | Your Supabase anon key    |

---

## Deployment

### Vercel Setup

1. Import the GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**.
4. Add environment variables (see above).
5. Configure branch deployments:
   - `main` → Production environment
   - `development` → Preview environment (Vercel does this automatically per-branch)

Vercel will build and deploy on every push. The `frontend/` subdirectory is the app root — no monorepo config is needed beyond setting the root directory.

---

## Row Level Security (RLS)

RLS is enabled on all three tables. The policies ensure:

| Table                  | Policy                                     | Rule                                       |
| ---------------------- | ------------------------------------------ | ------------------------------------------ |
| `profiles`             | `profiles_select_own_profile`              | `auth.uid() = id`                          |
| `profiles`             | `profiles_update_own_profile`              | `auth.uid() = id`                          |
| `organizations`        | `organizations_manage_own_orgs`            | `auth.uid() = created_by` (all operations) |
| `organization_members` | `organization_members_manage_by_org_admin` | Caller owns the parent organization        |

Critically, the `organization_members` policy uses a subquery to verify the caller owns the organization — meaning an admin can **only** read/write members of organizations they created. No cross-tenant data leakage is possible through the client.

The Edge Function uses `ctx.supabaseAdmin` (service role) to bypass RLS intentionally, but only after manually verifying ownership in application code — so the authorization is enforced in the function logic rather than delegated to RLS.

---

## Edge Functions

### `send-invite`

**Path:** `backend/supabase/functions/send-invite/index.ts`

**Method:** `POST`

**Request body:**

```json
{
  "organization_id": "uuid",
  "email": "member@example.com",
  "role": "member"
}
```

**What it does:**

1. Verifies the caller's JWT (`auth.getUser`)
2. Validates the request body with Zod
3. Looks up the organization and confirms `created_by === caller.id`
4. Inserts an `organization_members` row with `status: 'invited'`
5. Returns `201` with the created record

**Where email delivery would plug in:**
After the successful insert (line ~85 in `index.ts`), add:

```typescript
// await sendEmail({ to: normalizedEmail, template: 'invite', orgName: organization.name });
```

**Error responses:**

- `400` — validation failed (Zod errors returned)
- `401` — missing or invalid JWT
- `403` — caller does not own the organization
- `404` — organization not found
- `409` — invitation already exists for this email in this org
- `500` — unexpected server error

---

## Tradeoffs & Shortcuts

**No email confirmation on sign-up** — Supabase Auth's `enable_confirmations` is set to `false` in local config for frictionless onboarding during the assessment window. In production this should be enabled.

**`is_admin` profile flag is not enforced** — The `profiles.is_admin` column exists in the schema but the current RLS policies don't gate org creation on it. Any authenticated user can create orgs. With more time I'd add a policy that checks `is_admin = true` for organization writes, and a sign-up trigger that sets the flag.

**No real email delivery** — The Edge Function creates the invitation record but does not send an actual email. The architecture is wired for it — the send step is a single function call away.

## **No loading skeletons** — Loading states use simple text fallbacks rather than skeleton components. A proper skeleton pass would improve perceived performance.

## What I'd Do With Another Day

**Invitation acceptance flow** — Generate a signed link, send it via email, and create a route (`/invite/accept?token=...`) that signs the user up and links their `auth.user.id` to the pending `organization_members` row, flipping `status` to `active`.

**Enforce `is_admin` at the database level** — Add a Supabase Auth hook (or a `BEFORE INSERT` trigger) that creates a `profiles` row on sign-up and sets `is_admin = true` by default. Update RLS policies to check this flag.

**Role-based permissions within orgs** — The schema already has `member_role` with `owner`, `admin`, and `member` values. The next step is enforcing this in RLS — e.g. only `owner`/`admin` roles can invite new members.

**Search and filter on the directory page** — Add a search input on the Dashboard that filters organizations by name client-side (already feasible with the cached React Query data) or server-side with a Postgres `ilike` query.

**End-to-end tests with Playwright** — Cover the critical path: sign in → create org → invite member → verify member appears with `invited` status.

**Dark mode** — The CSS variables and Tailwind config are already structured for it (`dark:` variants are present in component files). Wiring up `next-themes` would be straightforward.

**Separate Supabase projects for dev and prod** — Currently one project serves both environments. A proper setup would use two Supabase projects with separate environment variables per Vercel environment.

**Error boundaries** — Add React error boundaries around page-level components so a data-fetching failure in one section doesn't crash the whole page.

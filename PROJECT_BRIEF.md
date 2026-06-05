# CNC Portal — Project Brief & Collaboration Guide
**Care Net Consultants (Pty) Ltd — Internal Management Portal**
**Version:** 1.0 | **Date:** 03 June 2026 | **Classification:** CONFIDENTIAL

---

## 1. What This Document Is

This is the single source of truth for everyone building the CNC Portal. If you are Cassandra, Barteld, or Odendaal, this document tells you:
- What has been built, where it lives, and how it connects to everything
- What you personally own and should touch
- What is in progress and what comes next
- How to not break each other's work

Read it fully before you touch the repo.

---

## 2. The Team

| Person | Role | GitHub handle (add once invited) | Focus area |
|--------|------|----------------------------------|------------|
| **Odendaal Oosthuizen** | IT & AI Development | `IT-CnC-Auto` | Architecture, back-end, data integrations, Supabase, Make.com, edge functions |
| **Cassandra** | Frontend & Web | *(invite needed)* | UI components, page layouts, design system execution, Ghost CMS |
| **Barteld Jans Bakker** | MD & Senior Stakeholder | *(invite needed)* | Content direction, strategic sign-off, final review before production releases |

### Adding Cassandra and Barteld to the repo
Go to: `https://github.com/Carenetconsultants/cnc-portal/settings/access`
Click **Add people** → invite each by email or GitHub username → assign role **Write** (both).

---

## 3. Repository Location & Access

| Item | Value |
|------|-------|
| GitHub org | `Carenetconsultants` |
| Repo name | `cnc-portal` |
| Visibility | **Private** |
| Default branch | `main` |
| Clone URL | `https://github.com/carenetconsultants/cnc-portal.git` |
| Local path (OD's machine) | `C:\Users\OdendaalOosthuizen\Downloads\cnc-portal\cnc-portal` |
| Live URL (Vercel production) | `https://cnc-portal-ten.vercel.app` |
| Custom domain (pending) | `portal.carenetconsultants.co.za` |

---

## 4. Collaboration Workflow — Branch Strategy

We work on **feature branches**. No one commits directly to `main` except for hotfixes.

```
main                ← production (auto-deploys to Vercel)
  └── develop       ← shared integration branch
        ├── feat/cassandra-dashboard-ui
        ├── feat/od-sales-sync
        ├── feat/barteld-content-review
        └── fix/[whatever broke]
```

### Rules
1. **Create your branch from `develop`**, not `main`
2. **Branch naming**: `feat/your-name-feature-description` or `fix/description`
3. **Before merging to develop**: create a Pull Request, at least one person reviews
4. **Only Odendaal merges develop → main** for now (until we have proper CI passing)
5. **Commit messages**: use plain English, descriptive — `feat: add pipeline KPI cards to sales page` not `update`

### Quickstart for Cassandra and Barteld
```bash
# Clone the repo (first time)
git clone https://github.com/carenetconsultants/cnc-portal.git
cd cnc-portal

# Install dependencies
npm install

# Copy env file and fill in values (see Section 8)
cp .env.example .env.local

# Start local development
npm run dev
# Opens at http://localhost:3000
```

---

## 5. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js (App Router) | 14.2.5 | Full-stack React framework |
| Language | TypeScript | 5.x | Type safety across all files |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Database | Supabase (PostgreSQL) | — | All portal data |
| Auth | Supabase Auth | — | Login (placeholder now, real soon) |
| Automation | Make.com | — | CRM data sync and workflows |
| CRM | AutoHive (GHL white-label) | — | Sales pipeline, contacts |
| CMS | Ghost | — | `care.carenetconsultants.co.za` |
| Voice AI | ElevenLabs + Telnyx | — | Sr Thandi agent (separate build) |
| Deployment | Vercel | — | Auto-deploy on push to `main` |
| CI/CD | GitHub Actions | — | Build check + Vercel deploy |

---

## 6. Repository File Structure

```
cnc-portal/
│
├── app/                          ← Next.js App Router (all routes live here)
│   ├── layout.tsx                ← Root HTML shell (fonts, globals)
│   ├── page.tsx                  ← Login / landing page (route: /)
│   ├── globals.css               ← Global styles + Tailwind directives
│   │
│   ├── (portal)/                 ← Authenticated portal group
│   │   ├── layout.tsx            ← Sidebar + top nav shell (wraps all portal pages)
│   │   ├── dashboard/
│   │   │   └── page.tsx          ← Executive dashboard (route: /dashboard)
│   │   ├── sales/
│   │   │   └── page.tsx          ← Sales pipeline (route: /sales) ← IN PROGRESS
│   │   ├── finance/
│   │   │   └── page.tsx          ← Finance overview (route: /finance) ← PLACEHOLDER
│   │   ├── operations/
│   │   │   └── page.tsx          ← Ops / CNIH (route: /operations) ← PLACEHOLDER
│   │   ├── hr/
│   │   │   └── page.tsx          ← HR & People (route: /hr) ← PLACEHOLDER
│   │   ├── marketing/
│   │   │   └── page.tsx          ← Marketing (route: /marketing) ← PLACEHOLDER
│   │   ├── compliance/
│   │   │   └── page.tsx          ← Compliance (route: /compliance) ← PLACEHOLDER
│   │   ├── academy/
│   │   │   └── page.tsx          ← Academy (route: /academy) ← PLACEHOLDER
│   │   ├── it/
│   │   │   └── page.tsx          ← IT & AI (route: /it) ← PLACEHOLDER
│   │   └── settings/
│   │       └── page.tsx          ← Portal settings (route: /settings) ← PLACEHOLDER
│   │
│   └── api/                      ← API routes (server-side only)
│       └── sales/
│           └── pipeline/
│               └── route.ts      ← GET /api/sales/pipeline → reads Supabase table
│
├── components/                   ← Reusable React components
│   ├── ui/                       ← Primitive UI elements (buttons, cards, inputs)
│   └── portal/                   ← Portal-specific composed components
│       ├── Sidebar.tsx            ← Navigation sidebar (all pages use this)
│       ├── TopNav.tsx             ← Top navigation bar
│       ├── KpiCard.tsx            ← Metric card (used on dashboard + sales)
│       └── PipelineTable.tsx      ← Sales pipeline rows table
│
├── lib/                          ← Shared utility functions
│   ├── supabase/
│   │   ├── client.ts             ← Browser-side Supabase client
│   │   └── server.ts             ← Server-side Supabase client (SSR/API routes)
│   └── utils.ts                  ← General helper functions
│
├── .env.example                  ← Template for env vars (committed, no secrets)
├── .env.local                    ← Your actual secrets (NEVER commit this)
├── .gitignore                    ← Ignores node_modules, .env.local, .next, etc.
├── next.config.mjs               ← Next.js configuration
├── package.json                  ← Dependencies + npm scripts
├── postcss.config.js             ← PostCSS config (required by Tailwind)
├── tailwind.config.ts            ← Tailwind + Care Net colour tokens
├── tsconfig.json                 ← TypeScript configuration
└── vercel.json                   ← Vercel deployment settings
```

---

## 7. Design System — Care Net Brand

Every page in the portal follows these rules. **Do not deviate** — brand consistency is a hard requirement (see SK-093 Brand Consistency in the Skill Library).

### Colours
```css
/* Primary palette */
--cnc-red:    #ED1B24;   /* Primary action, headers, active states */
--cnc-black:  #000000;   /* Primary text */
--cnc-white:  #FFFFFF;   /* Backgrounds, text on dark */

/* AutoHive brand — NEVER USE IN CNC PORTAL */
/* Navy #0A1F44 and Teal #009688 are AutoHive only */

/* Portal UI colours */
--sidebar-bg: #111111;   /* Sidebar background */
--card-bg:    #1a1a1a;   /* Card backgrounds on dark */
--border:     #2a2a2a;   /* Subtle borders */
--text-muted: #888888;   /* Secondary text */
```

In Tailwind config (`tailwind.config.ts`) these are exposed as:
```
bg-cnc-red       text-cnc-red       border-cnc-red
bg-cnc-black     text-cnc-white     etc.
```

### Typography
| Role | Font | Tailwind class |
|------|------|----------------|
| Headings | Montserrat Bold | `font-heading font-bold` |
| Body | Arial / system sans | `font-sans` |
| Code | JetBrains Mono | `font-mono` |

### Layout
- **Sidebar**: 240px fixed left, dark (`#111111`), CNC Red accent on active items
- **Main content**: remainder of viewport, slightly lighter dark (`#0d0d0d`)
- **Cards**: `#1a1a1a` background, 8px radius, subtle border
- **Top nav**: 64px height, shows page title + user avatar + notifications

### Component Rules
- All buttons: CNC Red (`#ED1B24`) primary, outlined secondary
- Status badges: Green `#22c55e` (good), Amber `#f59e0b` (caution), Red `#EF4444` (alert) — **NOT** CNC Red
- Tables: alternate row shading, sticky header, sortable columns
- Charts/KPIs: use Recharts library (already in package.json)
- Loading states: skeleton loaders, not spinners

---

## 8. Environment Variables

Everyone running locally needs a `.env.local` file. Copy `.env.example` and fill in:

```env
# Supabase — CNC Nexus project
NEXT_PUBLIC_SUPABASE_URL=https://dvanjuwmflvjvwtjjtds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YW5qdXdtZmx2anZ3dGpqdGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTA4NjQsImV4cCI6MjA5NTYyNjg2NH0._zkHOwFz2Ag3J1ZU6H9iH7ejfZpeZKfEEcD-aYITOnM
```

The Vercel production deployment already has these set under Project Settings → Environment Variables.

---

## 9. Integrations Map

This diagram shows how all external systems connect to the portal.

```
AutoHive CRM (GHL white-label)
    │
    │  Make.com Scenario 5276329
    │  "CNC Sales Pipeline → Supabase Sync"
    │  Runs: every 60 minutes
    │  Method: GHL listOpportunities → HTTP POST per record
    │
    ▼
Supabase (CNC Nexus)  ─────────────────────────────────────────────────────
│   Project ID: dvanjuwmflvjvwtjjtds                                       │
│   Region: eu-central-1                                                    │
│                                                                           │
│   Tables:                                                                 │
│   ├── integration_pipeline_opportunity  ← Sales pipeline data            │
│   │   (synced from AutoHive via Make.com)                                │
│   └── [more tables coming: finance, operations, hr, etc.]               │
│                                                                           │
│   PostgreSQL Functions:                                                   │
│   └── public.sync_opportunity()  ← SECURITY DEFINER, anon can call      │
│       Called by Make.com HTTP module per opportunity record              │
│                                                                           │
│   Edge Functions:                                                         │
│   └── sync-pipeline-opportunities (v9 DIAGNOSTIC — needs v10 production)│
│       URL: https://dvanjuwmflvjvwtjjtds.supabase.co/functions/v1/...    │
│                                                                           │
│   Auth: Supabase Auth (placeholder login active, real auth pending)      │
└───────────────────────────────────────────────────────────────────────────
    │
    │  Supabase JS client (lib/supabase/server.ts)
    │
    ▼
CNC Portal (Next.js on Vercel)
    │   https://cnc-portal-ten.vercel.app
    │   → portal.carenetconsultants.co.za (custom domain pending)
    │
    ├── /dashboard    ← Executive KPIs
    ├── /sales        ← Pipeline from integration_pipeline_opportunity
    ├── /finance      ← Xero integration (future)
    ├── /operations   ← CNIH / MyClinicOnline (future)
    └── [other modules]

Ghost CMS
    └── care.carenetconsultants.co.za (separate system, not in portal yet)

ElevenLabs + Telnyx
    └── Sr Thandi voice AI agent (separate build, not in portal yet)
```

---

## 10. Supabase — Key References

| Item | Value |
|------|-------|
| Project | CNC Nexus |
| Project ID | `dvanjuwmflvjvwtjjtds` |
| Dashboard | https://supabase.com/dashboard/project/dvanjuwmflvjvwtjjtds |
| Anon key (public) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...aYITOnM` |
| Business UUID | `4b0ac348-bdd5-4d2f-b8df-fa46eb58719a` |

### Table: `integration_pipeline_opportunity`

This is the sales pipeline data table, synced hourly from AutoHive CRM.

Key columns:

| Column | Type | Source |
|--------|------|--------|
| `autohive_opportunity_id` | text (PK) | AutoHive/GHL |
| `canonical_name` | text | Opportunity or contact name |
| `company_name` | text | Client company |
| `stage_name` | text | e.g. "Lead Captured", "Quotation Sent" |
| `stage_position` | int | 0–7 (pipeline order) |
| `stage_probability` | numeric | 11.11% – 88.89% |
| `monetary_value` | numeric | Deal value in ZAR |
| `status` | text | `open` / `won` / `lost` |
| `contact_email` | text | |
| `contact_phone` | text | |
| `synced_at` | timestamptz | Last sync timestamp |

### Pipeline Stages (AutoHive → Portal mapping)

| Stage ID | Stage Name | Position | Probability |
|----------|-----------|----------|-------------|
| `62826301...` | Lead Captured | 0 | 11.11% |
| `436f13e2...` | Contacted – Awaiting Response | 1 | 22.22% |
| `81fb0aa9...` | Discovery Call Booked | 2 | 33.33% |
| `77609562...` | Needs Identified – Proposal Pending | 3 | 44.44% |
| `b42f1915...` | Quotation Sent | 4 | 55.56% |
| `e83cc9c1...` | Negotiation / Follow-Up | 5 | 66.67% |
| `cc9ce133...` | Booking Confirmed | 6 | 77.78% |
| `3bdd64d8...` | Won – Active Client | 7 | 88.89% |

---

## 11. Make.com — Key References

| Item | Value |
|------|-------|
| Team ID | `1873877` |
| Scenario ID | `5276329` |
| Scenario name | CNC Sales Pipeline → Supabase Sync |
| Interval | 3600 seconds (hourly) |
| Operations | ~101/run × 24 runs/day × 30 days = ~72,720/month |
| Monthly limit | 120,000 operations |
| GHL connection | `8008286` (highlevel3 type) |
| Sales Pipeline ID | `ODVqF9PNkIltiRkwXShs` |
| Sync secret | `CNC-PLN-SYNC-2026-k9Mx2pRs7nQw4vLt` |

---

## 12. AutoHive CRM — Key References

AutoHive is a GHL white-label. Never call it GoHighLevel in any external materials.

| Item | Value |
|------|-------|
| Sales Pipeline | `ODVqF9PNkIltiRkwXShs` (created Nov 2024) |
| New Business Pipeline | Created May 2026 |
| Operational email | `info@mail.carenetconsultants.co.za` |
| Email domain | `mail.carenetconsultants.co.za` |

Round-robin lead assignment (Make.com Scenario 5051344):
- Rotation: Sire (1) → Gladys (2) → Elsie (3) → Celeste (4) → Maryna (5) → Annemarie (6)
- Trigger: new lead with "Assigned To" field **blank**

---

## 13. Current Build Status

### ✅ DONE
- Next.js 14 App Router project scaffolded
- TypeScript + Tailwind CSS configured with Care Net brand tokens
- Supabase client configured (browser + server)
- Portal shell: sidebar + top nav (authenticated layout)
- Login page placeholder
- Dashboard page (skeleton structure)
- Sales pipeline page (connected to Supabase, needs data sync to complete)
- API route: `GET /api/sales/pipeline`
- GitHub repo created (`Carenetconsultants/cnc-portal`) — private
- Vercel connected to GitHub, auto-deploys on push to `main`
- GitHub Actions CI workflow (`.github/workflows/deploy.yml`)
- `integration_pipeline_opportunity` Supabase table created
- `sync_opportunity()` Postgres function created (SECURITY DEFINER)
- Make.com scenario: AutoHive → Supabase sync (hourly, 101 ops/run)

### ⏳ IN PROGRESS
- **CRITICAL: Pipeline sync final step** — Edge Function is on v9 (diagnostic/no writes). Need to deploy v10 (production) that actually writes to the table. This is ~30 min of OD's time.
- Vercel custom domain `portal.carenetconsultants.co.za` — DNS CNAME in Xneelo pending
- Real Supabase Auth (replace placeholder login)

### 🔜 NEXT PRIORITIES

| Priority | Task | Owner |
|----------|------|-------|
| 1 | Fix pipeline sync: deploy Edge Function v10 | OD |
| 2 | Custom domain DNS in Xneelo | OD |
| 3 | Real Supabase auth (email/password login for team) | OD |
| 4 | Sales page UI — KPI cards + pipeline table | Cassandra |
| 5 | Dashboard page UI — executive overview | Cassandra |
| 6 | Finance page skeleton + Xero integration | OD |
| 7 | Operations page skeleton + CNIH connection | OD |
| 8 | Content and copy review on all visible text | Barteld |
| 9 | Add Cassandra + Barteld to GitHub repo | OD |
| 10 | GitHub branch protection rules on `main` | OD |

---

## 14. Page-by-Page Design Brief

### `/dashboard` — Executive Overview
**Owner: Cassandra (UI) + OD (data)**
**Status: Structure exists, needs content**

KPI cards across the top row (responsive grid):
- Monthly tests processed
- Active clients
- Pipeline value (ZAR)
- Revenue this month (from Xero, future)
- Open compliance items

Below: 2-column layout
- Left: Pipeline funnel chart (Recharts)
- Right: Recent activity feed + quick actions

Tone: professional command centre, dark, data-dense but readable.

---

### `/sales` — Sales Pipeline
**Owner: Cassandra (UI) + OD (data sync)**
**Status: Data connection built, UI needs polish**

Top row: 4 KPI cards
- Total opportunities
- Pipeline weighted value
- Win rate
- Avg days to close

Main: Kanban-style stage overview OR table view (toggle)
- Stage cards with opportunity count + total value
- Click to drill into stage → filtered table

Table columns: Name, Company, Stage, Value, Assigned To, Last Activity, Days in Stage

Data source: `integration_pipeline_opportunity` table in Supabase

---

### `/finance` — Finance Overview
**Owner: OD (Xero integration) + Cassandra (UI)**
**Status: Placeholder only**

Will connect to Xero via existing Supabase integration (xero edge functions already built separately).
- Revenue vs target
- Outstanding invoices
- VAT201 status
- Cash position

---

### `/operations` — Operations & Clinics
**Owner: OD (CNIH connection) + Cassandra (UI)**
**Status: Placeholder only**

Will read from CNIH (Firebase/Supabase) via MyClinicOnline.
- Tests processed this month by clinic/mobile unit
- Appointment schedule overview
- Mobile unit deployment status
- Equipment calibration status

---

### `/hr` — HR & People
**Owner: OD (data) + Cassandra (UI) + Barteld (content)**
**Status: Placeholder only**

- Headcount by department
- Leave overview
- Active compliance items (SANC registrations, etc.)
- Training completions

---

### `/compliance` — Compliance Dashboard
**Owner: OD + Barteld (content)**
**Status: Placeholder only**

- POPIA compliance status
- Regulatory filing calendar
- Audit trail summary
- Risk register

---

### `/academy` — Training Academy
**Owner: OD (content pipeline) + Cassandra (UI)**
**Status: Placeholder only**

- Course completions
- Accreditation status (LSM, CBD, SAIOSH)
- Trainer availability
- Upcoming sessions

---

## 15. What Cassandra Needs to Know Before Coding

1. **All components live in `/components`** — check there before building something new
2. **Use Tailwind only** — no styled-components, no inline styles, no external CSS frameworks
3. **CNC Red is `#ED1B24`** — use `bg-cnc-red` / `text-cnc-red` (defined in `tailwind.config.ts`)
4. **Dark theme** — the portal is dark throughout. Light backgrounds are wrong.
5. **SA English** — organise not organize, colour not color, in all visible text
6. **Recharts** is the chart library (installed). Use it for all data visualisations.
7. **Supabase reads in server components** — use `lib/supabase/server.ts` in page.tsx files. Use `lib/supabase/client.ts` only in client components that need real-time.
8. **Branch off `develop`** — create `feat/cassandra-[feature]`, PR back to develop when done

---

## 16. What Barteld Needs to Know Before Contributing

1. **Your role is content + direction**, not code. You don't need to touch TypeScript.
2. **Page copy** (headings, labels, help text) lives in the respective `page.tsx` file. Find it on GitHub and edit the text strings only.
3. **Create a branch** (`feat/barteld-content-[page]`), edit the text in the file, PR to develop.
4. **If unsure**, open a GitHub Issue describing what you want changed and assign to OD or Cassandra.
5. **Dashboard and compliance pages** will need your review before going live — you are the sign-off authority for those sections.

---

## 17. GitHub Actions — How Auto-Deploy Works

File: `.github/workflows/deploy.yml`

When anyone pushes to `main`:
1. GitHub checks out the code
2. Installs dependencies (`npm install`)
3. Builds the project (`npm run build`)
4. Deploys to Vercel production

**If the build fails**, nothing gets deployed and you'll see a red ✗ in the commit list on GitHub. Fix the error before merging to `main`.

Secrets required in GitHub (already set under repo Settings → Secrets):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 18. Contact & Escalation

| Issue | Who to contact |
|-------|---------------|
| Database / integrations / Edge Functions | Odendaal — `it@carenetconsultants.co.za` |
| UI / design / component bugs | Cassandra |
| Content, copy, strategic direction | Barteld — `barteld@carenetconsultants.co.za` |
| Production is down | OD first, then Barteld |
| AutoHive / Make.com issues | OD |
| Supabase billing / limits | OD |

---

## 19. Quick Reference — All URLs

| Service | URL |
|---------|-----|
| Portal (production) | https://cnc-portal-ten.vercel.app |
| Portal (custom domain, pending) | https://portal.carenetconsultants.co.za |
| GitHub repo | https://github.com/Carenetconsultants/cnc-portal |
| Vercel dashboard | https://vercel.com/auto-hive-wesite-developers/cnc-portal |
| Supabase dashboard | https://supabase.com/dashboard/project/dvanjuwmflvjvwtjjtds |
| Make.com scenario | https://eu1.make.com/1873877/scenarios/5276329 |
| Ghost CMS | https://care.carenetconsultants.co.za |
| AutoHive CRM | AutoHive platform (private link) |

---

## 20. POPIA Reminder

This portal processes personal and business data. Every page that displays or processes personal information must:
- Display data only to authenticated, authorised users
- Not expose clinical/medical test results (route to qualified OMP)
- Log access in audit trails where required
- Follow the Care Net POPIA S19 security safeguards

When building new pages that show sensitive data, check with OD before connecting live data.

---

*End of Project Brief*
*Care Net Consultants (Pty) Ltd — CONFIDENTIAL*
*PIF Framework v3.5 | Brand: Red #ED1B24 | SA English | POPIA Compliant*

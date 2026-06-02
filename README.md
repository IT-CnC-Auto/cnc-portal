# Care Net Consultants — Internal Portal

**Classification:** CONFIDENTIAL — Care Net Consultants (Pty) Ltd Internal Use Only  
**Version:** 0.1.0 (Test Scaffold)  
**Stack:** Next.js 14 (App Router) + Supabase + Tailwind CSS  
**Deployed via:** Vercel (carenetconsultants GitHub org)

---

## Overview

Centralised internal management portal for Care Net Consultants (Pty) Ltd.

| Module | Description | Skills |
|--------|-------------|--------|
| **Dashboard** | KPIs, activity feed, quick access | All |
| **Staff & HR** | Employee management, leave, recruitment | SK-050 to SK-054, SK-114–116 |
| **Finance** | Invoicing, VAT, SARS filing, management accounts | SK-060 to SK-064, SK-110–113 |
| **Sales & CRM** | Pipeline, client management, AutoHive CRM | SK-040 to SK-044, SK-121–124 |
| **Operations** | Clinic scheduling, mobile unit dispatch, QA | SK-080 to SK-084 |
| **Admin** | RBAC, audit trail, POPIA compliance, settings | SK-030, SK-032, SK-074 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 — App Router, TypeScript |
| Styling | Tailwind CSS with CNC brand tokens |
| Components | Custom components (no external UI library) |
| Auth + Database | Supabase |
| Deployment | Vercel |
| Source Control | GitHub (carenetconsultants org) |

---

## Brand

| Token | Value |
|-------|-------|
| Primary Red | `#ED1B24` |
| Black | `#000000` |
| White | `#FFFFFF` |
| Headings | Montserrat Bold |
| Body | Arial |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and populate with your Supabase credentials
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
cnc-portal/
├── app/
│   ├── (auth)/login/        ← Login page
│   ├── (portal)/            ← Authenticated portal
│   │   ├── dashboard/
│   │   ├── staff/
│   │   ├── finance/
│   │   ├── sales/
│   │   ├── operations/
│   │   └── admin/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/              ← Sidebar, Header
│   └── ui/                  ← StatCard, etc.
├── lib/
│   └── supabase/            ← Browser + server clients
├── .env.example
├── tailwind.config.ts       ← CNC brand tokens
└── vercel.json
```

---

## Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from **carenetconsultants** GitHub org → select `cnc-portal`
3. Set environment variables from `.env.example`
4. Deploy

---

## Compliance

- POPIA Act 4 of 2013
- OHS Act 85 of 1993
- BCEA Act 75 of 1997
- LRA Act 66 of 1995
- King IV Governance Principles

---

*Care Net Consultants (Pty) Ltd — Confidential Internal Use Only*  
*PIF Framework v3.5 | All 101 skills integrated into module roadmap*

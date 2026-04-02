# PermitOS

The Operating System for Building Permits. Track every project, automate submissions, eliminate bottlenecks.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the app.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Tables:** TanStack Table
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (dashboard)/     # Authenticated app pages
│   │   ├── dashboard/   # KPI cards, charts, tasks, agent activity
│   │   ├── projects/    # Project list + detail views
│   │   ├── permits/     # Permit tracking
│   │   ├── tasks/       # Task management
│   │   ├── documents/   # Document library
│   │   ├── jurisdictions/ # Jurisdiction database
│   │   ├── team/        # Team management
│   │   └── settings/    # App settings + integrations
│   ├── page.tsx         # Landing page
│   └── layout.tsx       # Root layout with metadata
├── components/
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Sidebar, topbar
│   ├── projects/        # Project table, filters, detail views
│   └── ui/              # Reusable UI primitives (shadcn-style)
└── lib/
    ├── data/            # Data access layer (swap mock → Prisma)
    ├── mock-data.ts     # Realistic South Florida permit data
    ├── types.ts         # Domain types
    ├── format.ts        # Formatting utilities
    ├── config.ts        # Environment variable access
    ├── auth.ts          # Auth placeholder (→ Clerk)
    └── db.ts            # Database placeholder (→ Prisma)
```

## Data Layer

All data access goes through `src/lib/data/`. Components import from `@/lib/data` — never directly from mock data. When ready to connect a real database, swap the implementations inside `src/lib/data/*.ts` without changing any components.

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new) for automatic deployments.

## Production Services to Connect

| Service | Purpose | Config Key |
|---------|---------|------------|
| Clerk | Authentication | `CLERK_SECRET_KEY` |
| PostgreSQL + Prisma | Database | `DATABASE_URL` |
| Cloudflare R2 / S3 | File storage | `S3_*` |
| Resend | Transactional email | `RESEND_API_KEY` |
| Sentry | Error tracking | `NEXT_PUBLIC_SENTRY_DSN` |
| PostHog | Product analytics | `NEXT_PUBLIC_POSTHOG_KEY` |
| Trigger.dev | Background jobs | `TRIGGER_API_KEY` |

See `.env.example` for all environment variables.

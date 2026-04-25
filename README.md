# 📅 BookSpace — Smart Resource Booking System

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-embedded-003B57?logo=sqlite)
![License](https://img.shields.io/badge/license-MIT-green)

> A modern, dark-themed resource booking application with automatic **conflict detection**, **10-minute buffer enforcement**, and real-time status tracking — built with Next.js App Router and Prisma ORM.

---

## 🌍 Real-World Problem It Solves

In shared workplaces — offices, co-working spaces, universities, and studios — **double-booking is a constant pain point**. Teams compete for the same conference rooms, projectors, and equipment. Without a centralized system:

- 🏃 People walk into occupied rooms mid-meeting
- 📞 Back-and-forth Slack messages to "check if the room is free"
- ⏱ No breathing room between back-to-back sessions (cleanup, setup)
- 😤 No visibility on who booked what, or when

**BookSpace solves this** by providing a single source of truth for shared resource availability, automatically blocking conflicting time slots (including a mandatory 10-minute buffer between bookings), and giving instant status feedback on every booking.

---

## 🏗️ System Design

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
│  BookingTabs ──► BookingForm  (POST /api/bookings)   │
│               ──► BookingDashboard (GET /api/bookings│
│                    BookingCard (DELETE /api/bookings) │
└────────────────────────┬────────────────────────────┘
                         │  HTTP (Next.js API Routes)
┌────────────────────────▼────────────────────────────┐
│              Next.js 15 — App Router (BFF)           │
│  /api/bookings/route.ts                              │
│    POST  → validate → conflict check → INSERT        │
│    GET   → filter by resource & date → SELECT        │
│    DELETE → find by ID → DELETE                      │
└────────────────────────┬────────────────────────────┘
                         │  Prisma Client
┌────────────────────────▼────────────────────────────┐
│              Prisma ORM + SQLite (embedded)           │
│  Model: Booking { id, resource, startTime, endTime,  │
│                   requestedBy, createdAt, updatedAt } │
└─────────────────────────────────────────────────────┘
```

### Architecture Decisions

| Concern | Decision | Rationale |
|---|---|---|
| **Framework** | Next.js 15 App Router | Co-locates API routes + UI in one codebase; no separate backend service needed |
| **Database** | SQLite via Prisma | Zero-config, file-based DB ideal for single-server deployments and local dev |
| **ORM** | Prisma | Type-safe queries, auto-generated client, migration system |
| **UI** | ShadCN + Tailwind v4 | Accessible component primitives with full style control |
| **Status computation** | Client-side | `ongoing / upcoming / past` is derived from current time at render, avoiding stale DB values |
| **Code splitting** | `React.lazy` on `BookingCard` | Defers heavy card JS bundle until the dashboard tab is active |
| **Data fetching** | Direct `fetch` in client component | Keeps it simple; `refreshTrigger` counter pattern syncs form → dashboard without context |

---

## ⚔️ How It Resolves Conflicts

Conflict detection runs **server-side before every INSERT**, using a 10-minute buffer window:

```
Requested Booking:      [  startTime ─────────── endTime  ]
Buffer zone:       [-10m]                              [+10m]

Conflict if any existing booking overlaps the buffered range.
```

### Algorithm (in `src/prisma-db.ts → addBooking`)

```typescript
const bufferMs = 10 * 60 * 1000; // 10 minutes in ms

// 1. Fetch all existing bookings for the same resource
const existingBookings = await prisma.booking.findMany({ where: { resource } });

// 2. Check for overlap using Array.some (short-circuits on first conflict found)
const hasConflict = existingBookings.some((booking) => {
  const bufferedStart = new Date(booking.startTime.getTime() - bufferMs);
  const bufferedEnd   = new Date(booking.endTime.getTime()   + bufferMs);

  // Overlap condition: new booking starts before buffered end AND ends after buffered start
  return startTime < bufferedEnd && endTime > bufferedStart;
});

// 3. Reject with 409 Conflict if overlapping
if (hasConflict) {
  return NextResponse.json({ message: "Slot conflicts with an existing booking or its 10-minute buffer." }, { status: 409 });
}

// 4. Safe to insert
await prisma.booking.create({ data: { resource, startTime, endTime, requestedBy } });
```

### Additional Validation Rules

| Rule | Enforcement |
|---|---|
| Start time must be in the future | Client (`validateBookingTime`) + Server logic |
| End time must be after start | Client validation |
| Minimum duration: 15 minutes | Client validation |
| Maximum duration: 2 hours | Client validation |
| No same-resource overlaps (+ 10 min buffer) | **Server-side**, pre-INSERT |
| Only `upcoming` bookings can be cancelled | Client (UI gate: `canDelete` flag) |

---

## ✨ Features

- 🌑 **Dark glassmorphism UI** — magenta/violet neon accents, glass cards, glow badges
- 📊 **Live stats dashboard** — total / ongoing / upcoming / past counts
- 🔍 **Filter by resource & date** — real-time server filtering via query params
- ⚡ **Status badges** — `ONGOING` (green glow), `UPCOMING` (violet), `PAST` (muted)
- ⏱ **Duration pill** — shows computed booking length (e.g. "1h 30m")
- 🚀 **Lazy-loaded cards** — `React.lazy` + `Suspense` for performance
- 🔔 **Toast notifications** — success / error feedback via Sonner
- 💀 **Skeleton loaders** — dark shimmer placeholders during data fetch
- 🗑️ **Cancel with confirmation** — AlertDialog guard before deletion

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | SQLite (via Prisma, embedded file) |
| ORM | [Prisma 6](https://www.prisma.io/) |
| UI Library | [ShadCN UI](https://ui.shadcn.com/) |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| Icons | [Lucide React](https://lucide.dev/) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |
| Font | Inter (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ikhtiaj-arif/booking-system.git
cd booking-system

# 2. Install dependencies (also runs prisma generate + migrate)
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment

The app uses an embedded SQLite file (`prisma/app.db`) by default — no `.env` setup required for local development.

For a PostgreSQL production deployment, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run postinstall` | Auto-runs `prisma generate` + `prisma migrate deploy` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/bookings/route.ts   # REST API: GET, POST, DELETE
│   ├── globals.css             # Dark glassmorphism theme tokens
│   ├── layout.tsx              # Root layout (Inter font, dark mode, Toaster)
│   └── page.tsx                # Hero page
├── components/
│   ├── BookingTabs.tsx         # Pill tab switcher (Dashboard / New Booking)
│   ├── BookingDashboard.tsx    # Stats + grouped booking list
│   ├── BookingCard.tsx         # Individual booking card with glow badges
│   ├── BookingForm.tsx         # Resource booking form with validation
│   ├── BookingsSkeleton.tsx    # Dark shimmer loading placeholders
│   ├── Filters.tsx             # Resource & date filters
│   └── ui/                     # ShadCN primitives (button, card, badge…)
├── lib/
│   ├── types.ts                # Booking interfaces + RESOURCES constant
│   └── utils.ts                # Date formatting, validation, status logic
└── prisma-db.ts                # Prisma client + DB access functions
prisma/
├── schema.prisma               # Booking model definition
└── migrations/                 # Prisma migration history
```

---

## ☁️ Deploying to Vercel

> **Important:** SQLite is a file-based database and does not work on Vercel (serverless/ephemeral filesystem). You need a hosted PostgreSQL database.

### Recommended: Neon (free serverless Postgres)

1. Create a free database at [neon.tech](https://neon.tech)
2. Copy the **connection string** from the Neon dashboard

### Steps

```bash
# 1. Push your code to GitHub
git push origin main

# 2. Import the repo at vercel.com/new

# 3. Set environment variable in Vercel dashboard:
#    Settings → Environment Variables
#    DATABASE_URL = postgresql://...your-neon-url...

# 4. Vercel auto-runs `npm run build` which calls:
#    prisma generate && next build
#    postinstall: prisma migrate deploy
```

### Environment Variables (Vercel Dashboard)

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon/Postgres connection string |

---

## 📄 License

MIT — feel free to use, fork, and adapt.
